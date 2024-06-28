import Editor from "@monaco-editor/react";
import { File } from "../utils/file-manager";
import { Socket } from "socket.io-client";
import React, { useCallback } from "react";

interface CodeProps {
  selectedFile: File | undefined;
  socket: Socket;
}

const Code = ({ selectedFile, socket }: CodeProps) => {
  if (!selectedFile) return null;

  const code = selectedFile.content;
  let language = selectedFile.name.split('.').pop();

  if (language === "js" || language === "jsx") language = "javascript";
  else if (language === "ts" || language === "tsx") language = "typescript";
  else if (language === "py") language = "python";

  const debounce = useCallback((func: (value: string) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (value: string | undefined) => {
      if (value !== undefined) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func(value);
        }, wait);
      }
    };
  }, []);

  const handleChange = debounce((value: string) => {
    socket.emit("updateContent", { path: selectedFile.path, content: value });
  }, 500);

  return (
    <Editor
      height="100vh"
      language={language}
      value={code}
      theme="vs-dark"
      onChange={(value) => handleChange(value ?? "")}
    />
  );
};

export default Code;

