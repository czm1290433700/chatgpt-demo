import { FC, useMemo, useState } from "react";
import { IChatGPTAnswer } from "../ChatGPTBody";
import "./index.css";

interface ILeftSidebarProps {
  apiKey: string;
  chatCache: IChatList[];
  onAnswerChange: (data: IChatGPTAnswer[], timestamp: number) => void;
  onApiChange: (apiKey: string) => void;
}

export interface IChatList {
  name: string;
  chatList: IChatGPTAnswer[];
  timestamp: number;
}

export const LeftSidebar: FC<ILeftSidebarProps> = ({
  apiKey,
  chatCache,
  onAnswerChange,
  onApiChange,
}) => {
  const [currentTimestamp, setCurrentTimestamp] = useState(0);

  const todayList = useMemo(() => {
    return chatCache.filter(
      (item) => Date.now() - item.timestamp < 24 * 60 * 60 * 1000
    );
  }, [chatCache]);

  const lastWeekList = useMemo(() => {
    return chatCache.filter(
      (item) =>
        Date.now() - item.timestamp < 24 * 60 * 60 * 1000 * 7 &&
        Date.now() - item.timestamp > 24 * 60 * 60 * 1000
    );
  }, [chatCache]);

  return (
    <div className="leftSidebar">
      <div
        className="leftSidebar_newChat"
        onClick={() => {
          onAnswerChange([], 0);
          setCurrentTimestamp(0);
        }}
      >
        New chat
      </div>
      <div className="leftSidebar_history">
        {todayList.length > 0 && (
          <div className="leftSidebar_historyArea">
            <div className="leftSidebar_title">Today</div>
            {todayList.map((item) => {
              return (
                <div
                  className={`leftSidebar_historyItem ${
                    item.timestamp === currentTimestamp
                      ? "leftSidebar_activeHistoryItem"
                      : ""
                  }`}
                  onClick={() => {
                    onAnswerChange(item.chatList, item.timestamp);
                    setCurrentTimestamp(item.timestamp);
                  }}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        )}
        {lastWeekList.length > 0 && (
          <div className="leftSidebar_historyArea">
            <div className="leftSidebar_title">Previous 7 Days</div>
            {lastWeekList.map((item) => {
              return (
                <div
                  className={`leftSidebar_historyItem ${
                    item.timestamp === currentTimestamp
                      ? "leftSidebar_activeHistoryItem"
                      : ""
                  }`}
                  onClick={() => {
                    onAnswerChange(item.chatList, item.timestamp);
                    setCurrentTimestamp(item.timestamp);
                  }}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="leftSidebar_bottom">
        <div className="leftSidebar_apiKeyTitle">API_KEY</div>
        <input
          className="leftSidebar_input"
          type="password"
          placeholder="请填写API_KEY"
          value={apiKey}
          onChange={(event) => {
            onApiChange(event.target.value);
            localStorage.setItem("chatgpt_api_key", event.target.value);
          }}
        ></input>
      </div>
    </div>
  );
};
