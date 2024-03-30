import { FC } from "react";
import "./index.css";

export interface IChatGPTAnswer {
  role: "user" | "assistant" | "system";
  content: string;
}

interface IChatGPTBodyProps {
  historyChat: IChatGPTAnswer[];
  apiKey: string;
}

export const ChatGPTBody: FC<IChatGPTBodyProps> = ({ historyChat, apiKey }) => {
  return (
    <div className="chatgptBody">
      <h1 className="chatgptBody_h1">ChatGPT 3.5</h1>
      {historyChat && historyChat.length > 0 ? (
        <div className="chatgptBody_content">
          {historyChat.map((item) => {
            return (
              <div className="chagptBody_item">
                <p className="chatgptBody_user">
                  {item.role === "user" ? "You" : "ChatGPT"}
                </p>
                <div className="chatgptBody_answer">{item.content}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="chatgptBody_default">How can I help you today?</div>
      )}
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
