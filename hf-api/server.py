from flask import Flask, request, jsonify
from transformers import pipeline, Conversation
from flask_cors import CORS, cross_origin


model_name = "demetrius007asfsafa/Gemma-2b-finetuned"


chatbot = pipeline(task="conversational", model=model_name)

app = Flask(__name__)
CORS(app)

conversation = []

@app.route("/chat", methods=["POST"])
@cross_origin()
def chat():
  data = request.json

  messages = data.get("messages", [])

  conversation_history = []
  for message in messages:
    conversation_history.append({"role": message["role"], "content": message["content"]})

  conversation_obj = Conversation(conversation_history)

  result = chatbot(conversation_obj)
  answer = str(result).split("assistant: ")[-1].strip()

  conversation.append({"role": "bot", "content": answer})

  return jsonify({"choices": [{"message": {"content": answer}}]}),200

if __name__ == "__main__":
  app.run(debug=True)
