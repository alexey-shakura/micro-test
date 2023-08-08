// app.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const {Configuration, OpenAIApi } = require('openai');


const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Replace with your actual API key

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Connect to the SQLite database
const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    return console.error('Error connecting to the database:', err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create a table (you can customize this according to your needs)
db.run(`
  CREATE TABLE IF NOT EXISTS sentences (
    id INTEGER PRIMARY KEY,
    original_sentence TEXT NOT NULL,
    corrected_sentence TEXT NOT NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

// Express middleware to parse JSON request bodies
app.use(express.json());

// Define a GET endpoint to render the HTML form
app.get('/', (req, res) => {
  const formHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Simple Form</title>
      </head>
      <body>
        <h1>Simple Form</h1>
        <form id="sentenceForm" action="/corrections" method="post">
          <label for="sentence">Sentence:</label>
          <input type="text" id="sentence" name="sentence" required>
          <button type="submit">Submit</button>
        </form>
        <div id="responseField"></div>

        <script>
          const form = document.getElementById('sentenceForm');
          const responseField = document.getElementById('responseField');

          form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const sentence = formData.get('sentence');

            try {
              const response = await fetch('/corrections', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sentence }),
              });

              const data = await response.json();

              // Display the response in the responseField
              responseField.innerHTML = '<p>Corrected Sentence: ' + data.message + '</p>';
            } catch (error) {
              responseField.innerHTML = '<p>Error occurred while fetching the response.</p>';
              console.error('Error occurred while fetching the response:', error.message);
            }
          });
        </script>
      </body>
    </html>
  `;

  res.send(formHTML);
});


// Define your routes here (example route included)
app.get('/corrections', (req, res) => {
  db.all('SELECT * FROM sentences', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching users from database' });
    }
    res.json(rows);
  });
});

// Define a POST endpoint to insert a new sentence into the "sentences" table
app.post('/corrections', async (req, res) => {
  const { sentence } = req.body;

  if (!sentence) {
    return res.status(400).json({ error: 'Please provide the "sentence" field in the request body.' });
  }

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: `Can you correct the grammar: ${sentence}`}],
  })

  const corrected_sentence = response.data.choices[0].message.content;

  // Insert the new sentence into the "sentences" table
  db.run('INSERT INTO sentences (original_sentence, corrected_sentence) VALUES (?, ?)', [sentence, corrected_sentence]);

  res.json({ message: corrected_sentence });
});

// Define a GET endpoint to get one random record from the "sentences" table
app.get('/random', (req, res) => {
  db.get('SELECT * FROM sentences ORDER BY RANDOM() LIMIT 1', (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching random sentence from database' });
    }
    if (!row) {
      return res.status(404).json({ error: 'No sentences found' });
    }
    res.json(row);
  });
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
