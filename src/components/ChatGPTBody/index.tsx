import { FC, useState } from "react";
import "./index.css";

export interface IChatGPTAnswer {
  role: "user" | "assistant" | "system";
  content: string;
}

export const ChatGPTBody = () => {
  const [historyChat, setHistoryChat] = useState<IChatGPTAnswer[]>([
    {
      role: "user",
      content: "你好",
    },
    {
      role: "assistant",
      content: "你好！有什么我可以帮助你的吗?",
    },
  ]);

  return (
    <div>
      <h1 className="chatgptBody_h1">ChatGPT 3.5</h1>
      <div className="chatgptBody_content">
        {historyChat.map((item) => {
          return (
            <div className="chagptBody_item">
              <p className="chatgptBody_user">
                {item.role === "user" ? "You" : "ChatGPT"}
              </p>
              <div>{item.content}</div>
            </div>
          );
        })}
      </div>
      <div className="chatgptBody_bottom">
        <div className="chatgptBody_bottomArea">
          <textarea
            className="chatgptBody_textarea"
            placeholder="Message ChatGPT..."
          ></textarea>
          <div className="chatgptBody_submit">send</div>
        </div>
      </div>
    </div>
  );
};
