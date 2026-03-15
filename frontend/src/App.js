import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [text,setText] = useState("");
  const [entries,setEntries] = useState([]);
  const [insights,setInsights] = useState(null);

  const userId = "123";

  const fetchEntries = async () => {
    const res = await axios.get(`https://ai-journal-system-1-9adz.onrender.com/api/journal/${userId}`);
    setEntries(res.data);
  };

  const fetchInsights = async () => {
    const res = await axios.get(`https://ai-journal-system-1-9adz.onrender.com/api/journal/insights/${userId}`);
    setInsights(res.data);
  };

  const handleAnalyze = async () => {

    const analyze = await axios.post("https://ai-journal-system-1-9adz.onrender.com/api/journal/analyze",{
      text
    });

    await axios.post("https://ai-journal-system-1-9adz.onrender.com/api/journal",{
      userId,
      ambience:"forest",
      text,
      emotion: analyze.data.emotion,
      keywords: analyze.data.keywords,
      summary: analyze.data.summary
    });

    setText("");

    fetchEntries();
    fetchInsights();
  };

  useEffect(()=>{
    fetchEntries();
    fetchInsights();
  },[]);

  return (
    <div style={{padding:"40px"}}>

      <h2>AI Journal System</h2>

      <textarea
        rows="5"
        cols="50"
        placeholder="Write your journal entry"
        value={text}
        onChange={(e)=>setText(e.target.value)}
      />

      <br/><br/>

      <button onClick={handleAnalyze}>
        Analyze
      </button>

      <h3>Entries</h3>

      {entries.map((e,i)=>(
        <div key={i} style={{border:"1px solid gray",margin:"10px",padding:"10px"}}>
          <p><b>Text:</b> {e.text}</p>
          <p><b>Emotion:</b> {e.emotion}</p>
          <p><b>Summary:</b> {e.summary}</p>
        </div>
      ))}

      <h3>Insights</h3>

      {insights && (
        <div>
          <p>Total Entries: {insights.totalEntries}</p>
          <p>Top Emotion: {insights.topEmotion}</p>
          <p>Most Used Ambience: {insights.mostUsedAmbience}</p>
        </div>
      )}

    </div>
  );
}

export default App;
