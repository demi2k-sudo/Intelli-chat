import requests
import json

# Replace with your server URL
server_url = "http://localhost:5000/chat"

# Conversation history (keep track of messages for sending requests)
conversation = []

def send_message(user_message):
  # Add user message to conversation history
  conversation.append({"role": "user", "content": user_message})

  # Prepare request data with conversation history
  request_data = {"messages": conversation}

  # Send POST request to the server with JSON data
  response = requests.post(server_url, json=request_data)

  # Check for successful response
  if response.status_code == 200:
    # Extract chatbot response from JSON
    response_data = response.json()
    bot_message = response_data["choices"][0]["message"]["content"]
    conversation.append({"role": "bot", "content": bot_message})
    print("Bot:", bot_message)
  else:
    print("Error:", response.status_code)

# Example usage
while True:
  user_message = input("You: ")
  send_message(user_message)
  if user_message == "quit":
    break
