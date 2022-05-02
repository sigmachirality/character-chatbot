import { useEffect, useState } from "react"
import Axios from "axios"

const BASE_URL = "https://character-chatbot.herokuapp.com/chat"

export default function Chatbox({ 
  user, bot
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setMessages([])
  }, [user?.name, bot?.name])
  
  const handleMessageSubmitFactory = (chatInput, messages) => (event) => {
    setDisabled(true);
    event.preventDefault();
    const message = {
      speaker: user?.name,
      text: chatInput
    }
    Axios.post(BASE_URL, {
      user,
      bot,
      messages: [...messages, message]
    }).then(res => {
      const newMessage = {
        speaker: bot?.name,
        text: res.data?.message
      }
      setMessages(prevMessages => [...prevMessages, message, newMessage])
      setNewMessage("")
      setDisabled(false);
    })
  }

  const handleMessageChange = (event) => {
    setNewMessage(event?.target?.value)
  }

  return <div className="chat-area">
    <div className="chat-window" id="chatbox">
      {messages.map(({ speaker, text }) => <div className={speaker === user?.name ? "human" : "bot"}>
        <p>{text}</p>
      </div>)}
    </div>

    <div className="user-entry-area">
      <form
        id="userInput"
        className="chat-entry"
        onSubmit={handleMessageSubmitFactory(newMessage, messages)}
      >
        <label title="Text input for the user's message to the GPT-3 persona" id="textLabel">
          <input 
            value={newMessage}
            type="text"
            name="human_input"
            id="textInput"
            onChange={handleMessageChange}
            placeholder={`Chat with ${bot?.name}...`}
            required
            disabled={disabled}
            autoComplete="off"
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
