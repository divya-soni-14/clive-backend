# Clive Backend

This repository contains the backend for a YouTube summarization application. It processes YouTube video transcripts, generates AI-powered summaries using the Gemini API, and manages user conversations. The server is built with Node.js and Express, providing RESTful and streaming endpoints for a React frontend.

## Features
- **YouTube Transcript Fetching**: Extracts transcripts from YouTube videos using `youtube-transcript`.
- **AI Summarization**: Summarizes transcripts with Google’s Gemini API, with an option to avoid spoilers.
- **Conversation Management**: Stores and retrieves conversation history per session, saved as JSON files.
- **Streaming Responses**: Supports real-time AI response streaming (if supported by the Gemini API).
- **REST API**: Handles video summarization and conversation updates via POST requests.

## Tech Stack
- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for routing and middleware.
- **Gemini API**: AI model for generating summaries and responses (assumes `@google/generative-ai` or similar).
- **File System**: Stores conversation data in JSON files.
- **Dependencies**: `youtube-transcript`, `uuid`, `cors`, `dotenv`, etc.

## Prerequisites
- **Node.js** (v16 or higher recommended)
- **Google Gemini API Key** (set via environment variable)
- **YouTube Video ID** (public videos with transcripts for testing)

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/youtube-summarizer-backend.git
cd youtube-summarizer-backend
```

### 2. Install Dependencies
```bash
npm install
```
**Key dependencies:**
- `express`: Web server framework
- `youtube-transcript`: Fetches YouTube transcripts
- `@google/generative-ai`: Gemini API client (or equivalent)
- `uuid`: Generates unique session IDs
- `cors`: Enables cross-origin requests
- `dotenv`: Loads environment variables

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```
- **GEMINI_API_KEY**: Your Google Gemini API key.
- **PORT**: Server port (defaults to 3000).

### 4. Run the Server
```bash
npm start
```
The server will start at [http://localhost:3000](http://localhost:3000) (or the specified port).

