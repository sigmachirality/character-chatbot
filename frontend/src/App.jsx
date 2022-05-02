import { useState, useEffect } from "react";
import Profile from "./components/Profile"
import Modal from "./components/Modal"
import Chatbox from "./components/Chatbox"
import characters from "./characters.json"

function App() {
  const [userCharacter, setUserCharacter] = useState("Kirk");
  const [customUserName, setCustomUserName] = useState("");
  const [customUserDescription, setCustomUserDescription] = useState("");
  const [customUserModalOpen, setCustomUserModalOpen] = useState(false);

  const [botCharacter, setBotCharacter] = useState("Spock");
  const [customBotName, setCustomBotName] = useState("");
  const [customBotDescription, setCustomBotDescription] = useState("");
  const [customBotModalOpen, setCustomBotModalOpen] = useState(false);

  const customUser = {
    name: customUserName,
    description: customUserDescription
  }
  const customBot = {
    name: customBotName,
    description: customBotDescription
  }

  const user = userCharacter === "Custom" ? customUser : {
    ...characters[userCharacter],
    name: userCharacter
  }
  const bot = botCharacter === "Custom" ? customBot : {
    ...characters[botCharacter],
    name: botCharacter
  }

  useEffect(() => {
    userCharacter === "Custom" && setCustomUserModalOpen(true)
  }, [userCharacter])
  useEffect(() => {
    botCharacter === "Custom" && setCustomBotModalOpen(true)
  }, [botCharacter])

  return (
    <>
      <Modal
        open={customUserModalOpen}
        setOpen={setCustomUserModalOpen}
        name={customUserName}
        setName={setCustomUserName}
        description={customUserDescription}
        setDescription={setCustomUserDescription}
      />
      <Modal
        open={customBotModalOpen}
        setOpen={setCustomBotModalOpen}
        name={customBotName}
        setName={setCustomBotName}
        description={customBotDescription}
        setDescription={setCustomBotDescription}
      />
      <div className="
        container
        mx-auto
        grid grid-cols-4
        p-8
      ">
        <div>
          <h1
            className="text-xl"
          >
            Characters:
          </h1>
          <Profile
            designation="User"
            character={userCharacter}
            setCharacter={setUserCharacter}
            customCharacter={customUser}
          />
          <Profile
            designation="Bot"
            character={botCharacter}
            setCharacter={setBotCharacter}
            customCharacter={customBot}
          />
        </div>
        <div className="col-span-3">
          <h1 className="ml-4 text-lg">Chatbox</h1>
          <Chatbox
            user={user}
            bot={bot}
            botCharacter={botCharacter}
          />
        </div>
      </div>
    </>
  );
}

export default App;
