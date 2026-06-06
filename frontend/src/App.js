import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [insights, setInsights] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const userId = "123";
  const API_BASE_URL = "https://ai-journal-system-1-9adz.onrender.com/api/journal";

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/${userId}`);
      setEntries(res.data);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/insights/${userId}`);
      setInsights(res.data);
    } catch (error) {
      console.error("Failed to fetch insights:", error);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const analyze = await axios.post(`${API_BASE_URL}/analyze`, { text });

      await axios.post(API_BASE_URL, {
        userId,
        ambience: "forest",
        text,
        emotion: analyze.data.emotion,
        keywords: analyze.data.keywords,
        summary: analyze.data.summary,
      });

      setText("");
      await fetchEntries();
      await fetchInsights();
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchInsights();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 pb-2">
            AI Journal System
          </h1>
          <p className="text-slate-500 font-medium">Capture your thoughts, powered by AI.</p>
        </header>

        {/* Insights Dashboard */}
        {insights && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center transition hover:shadow-md">
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Total Entries</span>
              <span className="text-3xl font-bold text-slate-800 mt-2">{insights.totalEntries}</span>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center transition hover:shadow-md">
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Top Emotion</span>
              <span className="text-xl font-bold text-indigo-600 mt-2 capitalize bg-indigo-50 px-4 py-1 rounded-full">{insights.topEmotion}</span>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center transition hover:shadow-md">
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Favorite Ambience</span>
              <span className="text-xl font-bold text-emerald-600 mt-2 capitalize bg-emerald-50 px-4 py-1 rounded-full">{insights.mostUsedAmbience}</span>
            </div>
          </section>
        )}

        {/* Journal Input Area */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
          <textarea
            rows="4"
            className="w-full bg-slate-50 text-slate-800 p-5 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none text-lg placeholder:text-slate-400"
            placeholder="What's on your mind today?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || isAnalyzing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                "Analyze Entry"
              )}
            </button>
          </div>
        </section>

        {/* Entries Feed */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-800 px-2">Recent Entries</h3>
          {entries.length === 0 ? (
            <p className="text-slate-500 text-center py-10">No entries yet. Start journaling above!</p>
          ) : (
            <div className="grid gap-6">
              {entries.map((e, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-indigo-100 transition-colors group">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <p className="text-slate-700 text-lg leading-relaxed flex-1 whitespace-pre-wrap">{e.text}</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 capitalize shrink-0">
                      {e.emotion}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">AI Summary</h4>
                    <p className="text-slate-600 text-sm">{e.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default App;