import { FC, useMemo, useState } from "react";
import { IChatGPTAnswer } from "../ChatGPTBody";
import "./index.css";

interface ILeftSidebarProps {
  apiKey: string;
  onAnswerChange: (data: IChatGPTAnswer[]) => void;
  onApiChange: (apiKey: string) => void;
}

interface IChatList {
  name: string;
  chatList: IChatGPTAnswer[];
  timestamp: number;
}

export const LeftSidebar: FC<ILeftSidebarProps> = ({
  apiKey,
  onAnswerChange,
  onApiChange,
}) => {
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const historyChatList: IChatList[] = [
    {
      name: "你好",
      chatList: [
        {
          role: "user",
          content: "你好",
        },
        {
          role: "assistant",
          content: "你好！有什么我可以帮助你的吗?",
        },
      ],
      timestamp: 1711765333087,
    },
    {
      name: "深圳有几个火车站",
      chatList: [
        {
          role: "user",
          content: "深圳有几个火车站",
        },
        {
          role: "assistant",
          content:
            "深圳是一个快速发展的城市，车站数量可能会不断增加，但是截止到我最后更新的时间2022年，深圳地铁的车站数量约为75个。这些车站建造的时间各不相同，因为深圳地铁的建设是分阶段进行的。深圳地铁的第一条线路于2004年12月28日开通，随后陆续开通了多条线路和分支线路，因此车站的建造时间也从2004年开始，但具体的时间会因为不同的线路和站点而有所不同。如果你需要详细的车站建造时间信息，建议查阅深圳地铁官方网站或相关资料。",
        },
      ],
      timestamp: 1711592426427,
    },
  ];

  const todayList = useMemo(() => {
    return historyChatList.filter(
      (item) => Date.now() - item.timestamp < 24 * 60 * 60 * 1000
    );
  }, [historyChatList]);

  const lastWeekList = useMemo(() => {
    return historyChatList.filter(
      (item) =>
        Date.now() - item.timestamp < 24 * 60 * 60 * 1000 * 7 &&
        Date.now() - item.timestamp > 24 * 60 * 60 * 1000
    );
  }, [historyChatList]);

  return (
    <div className="leftSidebar">
      <div
        className="leftSidebar_newChat"
        onClick={() => {
          onAnswerChange([]);
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
                    onAnswerChange(item.chatList);
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
                    onAnswerChange(item.chatList);
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
