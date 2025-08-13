# Voice Chat App (Rev Bot)

A simple **voice-based chatbot** that allows users to **ask questions in any language** and receive **answers in Hindi**. This app leverages the **Gemini API** for natural language understanding and generation.

## Features

- **Voice Input**: Speak your questions in any language.
- **Voice Output**: Get responses spoken back in Hindi.
- **Powered by Gemini API**: Uses Gemini API for accurate and contextual responses in Hindi.

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayushmittal0608/voice-chat-app.git
   ```

2. Frontend Implementation
   ```bash
   cd voice-chat-app
   npm run start
   ```

3. Backend Implementation
    ```bash
    cd backend
    npm start
    ```

4. Environment Variables
    ```bash
    GOOGLE_API_KEY=your_google_api_key
    ```

## How It Works
1. User clicks the microphone button and speaks a question in any language.
2. The app records the audio and converts it to text.
3. The text is sent to the Gemini API, which processes the input and generates a response in Hindi.
4. The response is read out loud using text-to-speech.

## Tech Stack
- Frontend: React.js
- Backend: Node.js / Express.js
- APIs: Gemini API
- Libraries: Web Speech API (for voice input/output), fetch, dotenv

## Usage
1. Click the microphone button.
2. Ask any question in any language.
3. Wait for the response to appear and be spoken aloud.