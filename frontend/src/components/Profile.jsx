import characters from "../characters.json"

const DEFAULT_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"

export default function Profile({
  character,
  designation,
  setCharacter,
  customCharacter
}) {
    const characterName = character === "Custom" ? customCharacter?.name : character
    const characterData = character === "Custom" ? customCharacter : characters[character]

    const handleChange = event => setCharacter(event?.target?.value)

    return <div
      className="p-4 my-4 rounded-lg"
      style={{
        backgroundColor: designation === "Bot" ? "#e1e1e1" : "#d3b2ff"
      }}
    >
      <div className="w-48 h-48 mx-auto">
        <img
          className="
            object-cover
            overflow-hidden
            w-full h-full
            rounded-full
          "
          referrerPolicy="no-referrer"
          src={characterData?.image ?? DEFAULT_IMAGE}
          alt={character}
        />
      </div>
      <div className="w-auto">
        <h1>{designation}: 
          <select
            onChange={handleChange}
            value={character}
          >
            {Object.keys(characters).map(character => <option value={character}>
              {character}
            </option>)}
            <option value="Custom">{character === "Custom" ? characterName : "CUSTOM CHAR"}</option>
          </select>
        </h1>
      </div>
      <p className="overflow-scroll h-10v">{characterData?.description}</p>
    </div>
  }