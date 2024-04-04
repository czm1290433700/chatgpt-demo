import { useEffect, useState } from "react";
import "./App.css";
import { ChatGPTBody, IChatGPTAnswer } from "./components/ChatGPTBody";
import { IChatList, LeftSidebar } from "./components/LeftSidebar";

function App() {
  const [historyChat, setHistoryChat] = useState<IChatGPTAnswer[]>([]);
  const [timestamp, setTimestamp] = useState(0); // historychat对应的timestamp
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("chatgpt_api_key") || ""
  );
  const [chatCache, setChatCache] = useState<IChatList[]>([]);

  useEffect(() => {
    if (localStorage.getItem("chatgpt_history_chat")) {
      setChatCache(
        JSON.parse(localStorage.getItem("chatgpt_history_chat") || "[]")
      );
    }
  }, []);

  return (
    <div className="home">
      <LeftSidebar
        chatCache={chatCache}
        onAnswerChange={(data, time) => {
          setHistoryChat(data);
          setTimestamp(time);
        }}
        onApiChange={setApiKey}
        apiKey={apiKey}
      />
      <ChatGPTBody
        historyChat={historyChat}
        apiKey={apiKey}
        timestamp={timestamp}
        onChange={setChatCache}
      />
    </div>
  );
}

export default App;
