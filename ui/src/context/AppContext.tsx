import React, { createContext, useContext, useState } from "react";
import type { MediaJob, Message } from "../types";

type AppContextValue = {
  chat: Message[];
  jobMap: Map<string, MediaJob>;
  selectedFile: string;
  setChat: React.Dispatch<React.SetStateAction<Message[]>>;
  setJobMap: React.Dispatch<React.SetStateAction<Map<string, MediaJob>>>;
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chat, setChat] = useState<Message[]>([]);
  const [jobMap, setJobMap] = useState<Map<string, MediaJob>>(new Map());
  const [selectedFile, setSelectedFile] = useState<string>("");
  return (
    <AppContext.Provider
      value={{
        chat,
        jobMap,
        selectedFile,
        setChat,
        setJobMap,
        setSelectedFile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const value = useContext(AppContext);
  if (!value) throw new Error("useAppContext must be used within AppProvider");
  return value;
};
