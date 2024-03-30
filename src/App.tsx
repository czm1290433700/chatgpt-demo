import { useState } from "react";
import "./App.css";
import { ChatGPTBody, IChatGPTAnswer } from "./components/ChatGPTBody";
import { LeftSidebar } from "./components/LeftSidebar";

function App() {
  const [historyChat, setHistoryChat] = useState<IChatGPTAnswer[]>([]);
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("chatgpt_api_key") || ""
  );

  return (
    <div className="home">
      <LeftSidebar
        onAnswerChange={setHistoryChat}
        onApiChange={setApiKey}
        apiKey={apiKey}
      />
      <ChatGPTBody historyChat={historyChat} apiKey={apiKey} />
    </div>
  );
}

export default App;
