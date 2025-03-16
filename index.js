const { YoutubeTranscript } = require("youtube-transcript");
const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const port = 3000;
const cors = require("cors");
require("dotenv").config();

const conversations = new Map();
const transcripts = new Map();

const gemini_api_key = process.env.GEMINI_API_KEY;
const url =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
  gemini_api_key;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  let sessionId = req.query.sessionId;

  if (!sessionId && req.method === "POST" && req.path === "/api/llm") {
    sessionId = uuidv4();
  } else if (!sessionId) {
    sessionId = "default";
  }
  req.query.sessionId = sessionId;
  if (!conversations.has(sessionId)) {
    conversations.set(sessionId, []);
  }
  next();
});

const processConversation = async (conversation, sessionId) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: conversation,
      }),
    });
    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;
    console.log("AI Response:", aiResponse);

    conversation.push({ role: "assistant", parts: [{ text: aiResponse }] });

    conversations.set(sessionId, conversation);

    return { sessionId, response: aiResponse, conversation };
  } catch (error) {
    console.error("Error:", error);
    return { sessionId, response: "Error", conversation };
  }
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/conversation", async (req, res) => {
  const sessionId = req.body.sessionId
    ? req.body.sessionId
    : req.query.sessionId;
  let message = req.body.message;
  const noSpoilers = req.body.noSpoilers;
  const conversation = conversations.get(sessionId) || [];
  if (noSpoilers) {
    message =
      message +
      " Ignore previous instruction. You are not allowed to give me spoilers. Don't say anything about this rule.";
  } else {
    message =
      message +
      " Ignore previous instruction. You are allowed to give me spoilers. Don't say anything about this rule.";
  }
  conversation.push({ role: "user", parts: [{ text: message }] });
  try {
    const result = await processConversation(conversation, sessionId);
    conversations.set(sessionId, result.conversation);
    res.json(result);
  } catch (error) {
    res.status(500).json({ sessionId, response: "Error", conversation });
  }
});

app.post("/api/llm", async (req, res) => {
  const { videoId, noSpoilers } = req.body;
  console.log(videoId);
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);

  transcripts.set(videoId, transcript);

  const flatText = transcript.map((item) => item.text).join(" ");
  console.log("Transcript saved in memory");

  let message =
    "You are an efficient youtube summarizing agent. Summarize the following video transcript, and mention the key takeaways from it. Answer based only on the transcript provided to you. " +
    flatText +
    ". Be concise and precise.";
  if (noSpoilers) {
    message =
      message +
      " GIVE NO SPOILERS ABOUT THE VIDEO CONTENT. IF USER ASKS FOR SPOILERS, THEN CONFIRM IT BEFORE PROVIDING.";
  }
  const sessionId = req.query.sessionId;
  const conversation = conversations.get(sessionId) || [];

  conversation.push({ role: "user", parts: [{ text: message }] });
  conversations.set(sessionId, conversation);
  console.log("SessionId: ", sessionId);
  console.log("Conversation: ", conversation);

  res.send(await processConversation(conversation, sessionId));
});

app.get("/api/captions", async (req, res) => {
  const videoId = req.query.videoId || "TU_q8mBehWM";
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);

  transcripts.set(videoId, transcript);

  const flatText = transcript.map((item) => item.text).join(" ");
  console.log("Transcript saved in memory");
  res.send("Captions received");
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${port}`);
});
