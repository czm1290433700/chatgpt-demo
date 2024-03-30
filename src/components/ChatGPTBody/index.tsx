import { default as LLMRequest } from "llm-request";
import { FC, useEffect, useMemo, useRef, useState } from "react";
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
  const contentRef = useRef<HTMLDivElement>(null);

  const [currentChat, setCurrentChat] = useState<IChatGPTAnswer[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    setCurrentChat(historyChat);
  }, [historyChat]);

  const submit = async (currentQuestion: string) => {
    const LLMRequestEntity = new LLMRequest(apiKey);
    let result = "";
    setCurrentChat([
      ...currentChat,
      {
        role: "user",
        content: currentQuestion,
      },
    ]);
    await LLMRequestEntity.openAIStreamChatCallback(
      {
        model: "gpt-3.5-turbo",
        messages: [
          ...currentChat,
          {
            role: "user",
            content: currentQuestion,
          },
        ],
        stream: true,
      },
      (res) => {
        result += res;
        setAnswer(result);
        // 自动滚动至底
        if (
          contentRef.current?.scrollTop &&
          contentRef.current?.scrollTop !== contentRef.current.scrollHeight
        ) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
      }
    );
    setCurrentChat([
      ...currentChat,
      {
        role: "user",
        content: currentQuestion,
      },
      {
        role: "assistant",
        content: result,
      },
    ]);
    setAnswer("");
  };

  const hasChat = useMemo(() => {
    // 存在历史 chat
    return currentChat && currentChat.length > 0;
  }, [currentChat]);

  return (
    <div className="chatgptBody">
      <h1 className="chatgptBody_h1">ChatGPT 3.5</h1>
      {hasChat ? (
        <div className="chatgptBody_content" ref={contentRef}>
          {currentChat.map((item) => {
            return (
              <div className="chagptBody_item">
                <p className="chatgptBody_user">
                  {item.role === "user" ? "You" : "ChatGPT"}
                </p>
                <div className="chatgptBody_answer">{item.content}</div>
              </div>
            );
          })}
          {/* 流过程展示用 */}
          {answer && (
            <div className="chagptBody_item">
              <p className="chatgptBody_user">ChatGPT</p>
              <div className="chatgptBody_answer">{answer}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="chatgptBody_default">How can I help you today?</div>
      )}
      <div className="chatgptBody_bottom">
        <div className="chatgptBody_bottomArea">
          <textarea
            className="chatgptBody_textarea"
            placeholder="Message ChatGPT..."
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && question) {
                event.preventDefault();
                submit(question);
                setQuestion("");
              }
            }}
          ></textarea>
          <div
            className={`chatgptBody_submit ${
              !question ? "chatgptBody_disabled" : ""
            }`}
            onClick={() => {
              if (question) {
                submit(question);
                setQuestion("");
              }
            }}
          >
            send
          </div>
        </div>
      </div>
    </div>
  );
};
