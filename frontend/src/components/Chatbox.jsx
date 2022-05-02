import { useState } from "react"
import Axios from "axios"

export default function Chatbox({ botCharacter = "the bot!" }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  
  const handleMessageSubmit = (event) => {
    event.preventDefault();
  }

  const handleMessageChange = (event) => {
    setNewMessage(event?.target?.value)
  }

  return <div className="chat-area">
    <div className="chat-window" id="chatbox">
      {messages.map(({ speaker, text}) => <div className={speaker}>
        <p>{text}</p>
      </div>)}
    </div>

    <div className="user-entry-area">
      <form
        id="userInput"
        className="chat-entry"
        onSubmit={handleMessageSubmit}
      >
        <label title="Text input for the user's message to the GPT-3 persona" id="textLabel">
          <input 
            type="text"
            name="human_input"
            id="textInput"
            onChange={handleMessageChange}
            placeholder={`Chat with ${botCharacter}...`}
            required
            autocomplete="off"
          />
        </label>
        <label title="Send button">
          <input type="submit" value="Send" id="send" />
        </label>
      </form>

      <form action="/" method="GET" className="chat-entry">
        <label title="New chat button">
          <input type="submit" value="Reset Chat" id="new-chatbot" />
        </label>
      </form>
    </div>
  </div>
}
