from flask import Flask, request, jsonify
from transformers import pipeline, Conversation
from flask_cors import CORS, cross_origin

# Replace with your desired model name
model_name = "demetrius007asfsafa/Gemma-2b-finetuned"

# Load the chatbot model
chatbot = pipeline(task="conversational", model=model_name)

app = Flask(__name__)
CORS(app)
# Conversation history (consider using a more robust data structure for persistence)
conversation = []

@app.route("/chat", methods=["POST"])
@cross_origin()
def chat():
  # Get the request data as JSON
  data = request.json

  # Extract conversation history from the request
  messages = data.get("messages", [])

  # Process conversation history (assuming roles are already assigned)
  conversation_history = []
  for message in messages:
    conversation_history.append({"role": message["role"], "content": message["content"]})

  # Create a Conversation object with the processed history
  conversation_obj = Conversation(conversation_history)

  # Generate chatbot response using the conversation
  result = chatbot(conversation_obj)
  answer = str(result).split("assistant: ")[-1].strip()

  # Add chatbot response to conversation history (optional for server-side tracking)
  conversation.append({"role": "bot", "content": answer})

  # Return the chatbot response in the expected format
  return jsonify({"choices": [{"message": {"content": answer}}]}),200

if __name__ == "__main__":
  app.run(debug=True)
