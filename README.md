To launch the provided code, you can follow these steps:

1. **Install Node.js and npm:**
   If you haven't already, make sure you have Node.js and npm installed on your machine. You can download them from the official Node.js website: https://nodejs.org. The project is made on Node v16.17.0 and npm v8.15.0 but may try newer versions

2. **Install Dependencies:**
   In your project directory, run the following command to install the required packages:

   ```bash
   npm install
   ```

3. **Set Environment Variables:**
   Open your terminal and set your OpenAI API key as an environment variable. Replace `'YOUR_OPENAI_API_KEY'` with your actual OpenAI API key.

   For Unix-like systems (Linux, macOS):
   ```bash
   export OPENAI_API_KEY=YOUR_OPENAI_API_KEY
   ```

   For Windows (Command Prompt):
   ```bash
   set OPENAI_API_KEY=YOUR_OPENAI_API_KEY
   ```

   For Windows (PowerShell):
   ```bash
   $env:OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
   ```

4. **Run the Application:**
   To run the application, in your terminal, run the following command:

   ```bash
   npm start
   ```

5. **Access the Application:**
   Once the server is running, you can access the application by opening your web browser and navigating to http://localhost:3000. This should display the form where you can input a sentence. After submitting the form, the corrected sentence should be displayed below the form.

6. **Test Endpoints:**
   You can also test the different endpoints using tools like cURL or a tool like Postman. Here are some example requests:

   - To fetch random sentence:
     ```bash
     curl http://localhost:3000/random
     ```

   - To fetch all corrections from the database:
     ```bash
     curl http://localhost:3000/corrections
     ```

7. **Cleanup:**
   If you're done testing, you can stop the application by pressing `Ctrl + C` in your terminal.

That's it! With these steps, you should be able to launch and test the application. 
