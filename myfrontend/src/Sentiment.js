import React, { useState, useEffect } from "react";
import { Smile, Frown, Meh, Sparkles, Brain, Zap } from "lucide-react";

const SentimentAnalyzer = () => {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Particle system
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(newParticles);

    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x: (particle.x + particle.vx + window.innerWidth) % window.innerWidth,
          y:
            (particle.y + particle.vy + window.innerHeight) %
            window.innerHeight,
        }))
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();

      setTimeout(() => {
        setResult({ sentiment: data.sentiment, confidence: data.confidence });
        setIsAnalyzing(false);
      }, 2000);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
    }
  };

  const getSentimentIcon = (sentiment) => {
    const iconClass = "w-12 h-12 drop-shadow-lg animate-bounce";
    switch (sentiment) {
      case "positive":
        return <Smile className={`${iconClass} text-green-400`} />;
      case "negative":
        return <Frown className={`${iconClass} text-red-400`} />;
      default:
        return <Meh className={`${iconClass} text-yellow-400`} />;
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "🎉";
      case "negative":
        return "💔";
      default:
        return "🤔";
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              transform: `translate(-50%, -50%)`,
            }}
          />
        ))}
      </div>

      {/* Mouse Follow Glow Effect */}
      <div
        className="absolute pointer-events-none z-10"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="w-64 h-64 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-20 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          {/* Header with 3D Text Effect */}
          <div className="text-center mb-12">
            <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 animate-pulse transform hover:scale-105 transition-all duration-500 drop-shadow-2xl">
              AI SENTIMENT
            </h1>
            <div className="flex items-center justify-center gap-4 mb-4">
              <Brain className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-2xl text-white/80 font-light">
                Neural Network Emotion Detection
              </p>
              <Zap className="w-8 h-8 text-yellow-400 animate-bounce" />
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full animate-pulse" />
          </div>

          {/* Main Container with Glass Morphism */}
          <div className="backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 transform hover:scale-102 transition-all duration-500">
            {/* Input Section */}
            <div className="mb-8">
              <label className="block text-white/90 text-lg font-medium mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                Enter your text for AI analysis:
              </label>
              <div className="relative group">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full p-6 bg-black/30 backdrop-blur-sm text-white placeholder-white/50 border-2 border-white/20 rounded-2xl focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/20 resize-none transition-all duration-300 text-lg group-hover:bg-black/40"
                  rows="4"
                  placeholder="Type something magical here... ✨"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            {/* Analyze Button with Crazy Animation */}
            <button
              onClick={handleAnalyze}
              disabled={!inputText.trim() || isAnalyzing}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-xl shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative flex items-center justify-center gap-3">
                {isAnalyzing ? (
                  <>
                    <div className="flex space-x-1">
                      <div
                        className="w-3 h-3 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-3 h-3 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-3 h-3 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <span className="animate-pulse">AI is thinking...</span>
                    <Brain className="w-6 h-6 animate-spin" />
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6 animate-pulse" />
                    <span>ANALYZE WITH AI</span>
                    <Sparkles className="w-6 h-6 animate-bounce" />
                  </>
                )}
              </div>
            </button>

            {/* Results with Insane 3D Effects */}
            {result && (
              <div className="mt-8 transform animate-fadeInUp">
                <div
                  className={`relative p-8 rounded-3xl border-2 backdrop-blur-lg shadow-2xl transform hover:scale-105 transition-all duration-500 ${
                    result.sentiment === "positive"
                      ? "bg-green-500/20 border-green-400/50"
                      : result.sentiment === "negative"
                      ? "bg-red-500/20 border-red-400/50"
                      : "bg-yellow-500/20 border-yellow-400/50"
                  }`}
                >
                  {/* Floating Emoji */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="text-6xl animate-bounce drop-shadow-2xl">
                      {getSentimentEmoji(result.sentiment)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-8 pt-4">
                    <div className="flex items-center gap-6">
                      <div className="transform hover:rotate-12 transition-transform duration-300">
                        {getSentimentIcon(result.sentiment)}
                      </div>
                      <div>
                        <h3
                          className={`text-5xl font-black capitalize mb-2 ${
                            result.sentiment === "positive"
                              ? "text-green-400"
                              : result.sentiment === "negative"
                              ? "text-red-400"
                              : "text-yellow-400"
                          } drop-shadow-lg animate-pulse`}
                        >
                          {result.sentiment}
                        </h3>
                        <p className="text-white/70 text-lg animate-fadeIn">
                          AI Confidence Analysis
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-6xl font-black mb-2 ${
                          result.sentiment === "positive"
                            ? "text-green-400"
                            : result.sentiment === "negative"
                            ? "text-red-400"
                            : "text-yellow-400"
                        } drop-shadow-lg animate-countUp`}
                      >
                        {(result.confidence * 100).toFixed(1)}%
                      </div>
                      <p className="text-white/70 text-lg">Neural Confidence</p>
                    </div>
                  </div>

                  {/* 3D Confidence Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white font-semibold text-lg">
                        Confidence Level
                      </span>
                      <span
                        className={`font-bold text-lg ${
                          result.sentiment === "positive"
                            ? "text-green-400"
                            : result.sentiment === "negative"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {result.confidence >= 0.8
                          ? "EXTREMELY HIGH 🔥"
                          : result.confidence >= 0.6
                          ? "HIGH ⚡"
                          : result.confidence >= 0.4
                          ? "MEDIUM 📊"
                          : "LOW 🤔"}
                      </span>
                    </div>
                    <div className="relative w-full h-6 bg-black/30 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-2000 ease-out relative overflow-hidden ${
                          result.sentiment === "positive"
                            ? "bg-gradient-to-r from-green-500 to-green-300"
                            : result.sentiment === "negative"
                            ? "bg-gradient-to-r from-red-500 to-red-300"
                            : "bg-gradient-to-r from-yellow-500 to-yellow-300"
                        }`}
                        style={{ width: `${result.confidence * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>

                  {/* Fun Messages */}
                  <div className="text-center p-4 bg-black/20 rounded-2xl backdrop-blur-sm">
                    <p className="text-white text-lg font-medium animate-pulse">
                      {result.sentiment === "positive" &&
                        "🎊 Woah! This text is radiating positive vibes! ✨"}
                      {result.sentiment === "negative" &&
                        "💫 The AI detected some negative emotions here 🌙"}
                      {result.sentiment === "neutral" &&
                        "🧠 Perfectly balanced emotions detected by our AI 🤖"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Example Prompts */}
          <div className="mt-12 text-center">
            <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 border border-white/10">
              <h4 className="font-bold text-white text-xl mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                Try these mind-blowing examples:
              </h4>
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  "I absolutely love this incredible experience! 🚀",
                  "This is absolutely terrible and disappointing 😞",
                  "The weather seems pretty normal today 🌤️",
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(example)}
                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/40 hover:to-pink-500/40 text-white px-4 py-2 rounded-xl border border-white/20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalyzer;
