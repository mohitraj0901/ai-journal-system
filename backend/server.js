require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");



const Journal = require("./models/journal");

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req,res)=>{
    res.send("AI Journal API running");
});

app.post("/api/journal/analyze", async (req, res) => {
  try {
    const text = req.body.text;

    const prompt = `
    Analyze the following journal entry and return:
    1. Emotion
    2. Keywords
    3. Short summary

    Journal entry: ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    res.json({
      analysis: response
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

app.get("/api/journal/:userId", async(req,res)=>{
    const entries = await Journal.find({userId:req.params.userId});
    res.json(entries);
});

app.get("/api/journal/insights/:userId", async(req,res)=>{

    const entries = await Journal.find({userId:req.params.userId});

    const totalEntries = entries.length;

    res.json({
        totalEntries,
        topEmotion:"calm",
        mostUsedAmbience:"forest",
        recentKeywords:["focus","nature","rain"]
    });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});