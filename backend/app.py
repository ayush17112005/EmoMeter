from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

sentiment_pipeline = pipeline("sentiment-analysis")

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text", "")
    if not text.strip():
        return jsonify({"error": "No text provided"}), 400

    result = sentiment_pipeline(text)[0]
    return jsonify({
        "sentiment": result["label"].lower(),
        "confidence": result["score"]
    })

if __name__ == "__main__":
    app.run(debug=True)
