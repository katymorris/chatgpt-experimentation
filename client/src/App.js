import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'


function App() {

  useEffect(() => { 
    getEngines();
    }, []); // <-- empty array means "run once" (like componentDidMount))

  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("ada");
  const [chatLog, setChatLog] = useState([{
    user: "gpt",
    message: "How can i help you today?"
  }]);

  async function getEngines() {
    var requestOptions = {
      method: 'GET'
    };
    
    fetch("http://localhost:3080/models")
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setModels(data.data.data)
      })
      .catch(error => console.log('error', error));
  }

  function clearChat() {
    setChatLog([]);
  }

  async function formSubmitted(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "me", message: `${input}`}]
    setInput("");
    setChatLog(chatLogNew);
    const messages = chatLogNew.map((message) => message.message).join("\n");
    const response = await fetch("http://localhost:3080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: messages,
        currentModel: currentModel
      })
    })
    const data = await response.json();
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}`}])
    console.log(data.message)
  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <button className="sidemenu-button" onClick={clearChat}><span>+ </span>New Chat</button>
        <div className='models'>
        <select onChange={(e) => {
          setCurrentModel(e.target.value);
        }}>
          {models.map((model, index) => (
            <option key={model.id} value={model.id}>{model.id}</option>
          ))}
        </select>
      </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-container">
          <form onSubmit={formSubmitted}>
            <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="chat-input" placeholder="Please type your message here..."></input>
          </form>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user === "gpt" && "chatgpt"}` }>
    <div className={`avatar ${message.user === "gpt" && "chatgpt"}` }></div>
    <div className="message">{message.message}</div>
  </div>
  )
}

export default App;
