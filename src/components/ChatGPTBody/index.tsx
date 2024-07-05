import { default as LLMRequest } from "llm-request";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { IChatList } from "../LeftSidebar";
import { MarkdownParser } from "../MarkdownParser";
import hljs from "highlight.js";
import "highlight.js/styles/default.css";
import "./index.css";
import { Select } from "@douyinfe/semi-ui";
import useGetCollections from "../UploadModal/hooks/useGetCollections";

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
  const [systemPrompt, setSystemPrompt] = useState("");
  const [currentTimestamp, setCurrentTimestamp] = useState(timestamp);
  const [collectionName, setCollectionName] = useState('');

  useEffect(() => {
    setCurrentChat(historyChat);
    setCurrentTimestamp(timestamp);
  }, [historyChat, timestamp]);

  useEffect(() => {
    hljs.highlightAll();
  }, [currentChat]);

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
          ...(systemPrompt
            ? ([
              {
                role: "system",
                content: systemPrompt,
              },
            ] as IChatGPTAnswer[])
            : []),
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
    if (currentTimestamp) {
      // 历史存量的变更
      const chatIndex = chatCache.findIndex(
        (item) => item.timestamp === currentTimestamp
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
      const time = new Date().getTime();
      setCurrentTimestamp(time);
      chatCache.push({
        name: currentQuestion,
        chatList: newChatList,
        timestamp: time,
      });
    }
    onChange(chatCache);
    localStorage.setItem("chatgpt_history_chat", JSON.stringify(chatCache));
  };

  const hasChat = useMemo(() => {
    // 存在历史 chat
    return currentChat && currentChat.length > 0;
  }, [currentChat]);

  const collections = useGetCollections();

  return (
    <div className="chatgptBody">
      <div className="chatgptBody_top">
        <h1 className="chatgptBody_h1">ChatGPT 3.5</h1>
        <div className="chatgptBody_embeddingsSelectArea">
          <span className="chatgptBody_embeddingsSelectArea_label">向量知识库</span>
          <Select value={collectionName} onChange={(data) => { setCollectionName(String(data)) }} filter>
            <Select.Option value={""}>不使用向量知识库</Select.Option>
            {collections.map((item) => {
              return (
                <Select.Option value={item}>{item}</Select.Option>
              )
            })}
          </Select>
        </div>
      </div>
      {hasChat ? (
        <div className="chatgptBody_content" ref={contentRef}>
          {currentChat.map((item) => {
            return (
              <div className="chagptBody_item">
                <p className="chatgptBody_user">
                  {item.role === "user" ? "You" : "ChatGPT"}
                </p>
                <MarkdownParser answer={item.content} />
              </div>
            );
          })}
          {/* 流过程展示用 */}
          {answer && (
            <div className="chagptBody_item">
              <p className="chatgptBody_user">ChatGPT</p>
              <MarkdownParser answer={answer} />
            </div>
          )}
        </div>
      ) : (
        <div className="chatgptBody_default">
          <div className="chatgptBody_default_title">
            How can I help you today?
          </div>
          <div className="chatgptBody_default_system_prompt">
            <div className="chatgptBody_default_label">System Prompt</div>
            <textarea
              className="chatgptBody_default_textarea"
              placeholder="Fill in System Prompt..."
              value={systemPrompt}
              onChange={(event) => {
                setSystemPrompt(event.target.value);
              }}
            ></textarea>
          </div>
        </div>
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
            className={`chatgptBody_submit ${!question ? "chatgptBody_disabled" : ""
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
