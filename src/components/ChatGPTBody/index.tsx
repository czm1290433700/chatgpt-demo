import { default as LLMRequest } from "llm-request";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { IChatList } from "../LeftSidebar";
import "./index.css";

export interface IChatGPTAnswer {
  role: "user" | "assistant" | "system";
  content: string;
}

interface IChatGPTBodyProps {
  historyChat: IChatGPTAnswer[];
  apiKey: string;
  timestamp: number;
  onChange: (list: IChatList[]) => void;
}

export const ChatGPTBody: FC<IChatGPTBodyProps> = ({
  historyChat,
  apiKey,
  timestamp,
  onChange,
}) => {
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
    const newChatList: IChatGPTAnswer[] = [
      ...currentChat,
      {
        role: "user",
        content: currentQuestion,
      },
      {
        role: "assistant",
        content: result,
      },
    ];
    setCurrentChat(newChatList);
    setAnswer("");
    // 缓存当前记录
    const chatCache: IChatList[] = JSON.parse(
      localStorage.getItem("chatgpt_history_chat") || "[]"
    );
    if (timestamp) {
      // 历史存量的变更
      const chatIndex = chatCache.findIndex(
        (item) => item.timestamp === timestamp
      );
      if (chatIndex !== -1) {
        // 历史存量只更新list
        chatCache.splice(chatIndex, 1, {
          ...chatCache[chatIndex],
          chatList: newChatList,
        });
      } else {
        // index不存在，走新增场景
        chatCache.push({
          name: currentQuestion,
          chatList: newChatList,
          timestamp: new Date().getTime(),
        });
      }
    } else {
      // 无时间戳新建
      chatCache.push({
        name: currentQuestion,
        chatList: newChatList,
        timestamp: new Date().getTime(),
      });
    }
    onChange(chatCache);
    localStorage.setItem("chatgpt_history_chat", JSON.stringify(chatCache));
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
