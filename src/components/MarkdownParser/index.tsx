import { FC, useMemo } from "react";
import "./index.css";

interface IMarkdownParserProps {
  answer: string;
}

export const MarkdownParser: FC<IMarkdownParserProps> = ({ answer }) => {
  const formatCode = useMemo(() => {
    // 将\n替换为<br />
    let formattedStr = answer.replace(/\n/g, "<br />");

    // 查找以```开始并以```结束的代码块，并提取语言标识和代码内容
    const codeBlockPattern = /```([\s\S]+?)```/g;

    let match;
    while ((match = codeBlockPattern.exec(formattedStr)) !== null) {
      const language = match[1].split("<br />")[0];
      const codeContent = match[1].split("<br />").slice(1).join("<br />");

      // 替换当前代码块为带有语言标识和代码内容的新格式
      const formattedCode = `<div>
         <div>${language}</div>
         <code>${codeContent.trim()}</code>
       </div>`;
      formattedStr =
        formattedStr.slice(0, match.index) +
        formattedCode +
        formattedStr.slice(match.index + match[0].length);
    }

    // 最后将整个结果包裹在<div>...</div>中
    return `<div class="markdownParser">${formattedStr}</div>`;
  }, [answer]);

  return <div dangerouslySetInnerHTML={{ __html: formatCode }} />;
};