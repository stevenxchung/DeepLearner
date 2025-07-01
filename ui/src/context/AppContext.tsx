import React, { createContext, useContext, useState } from "react";
import type { MediaJob, Message } from "../types";

type AppContextValue = {
  chat: Message[];
  jobMap: Map<string, MediaJob>;
  setChat: React.Dispatch<React.SetStateAction<Message[]>>;
  setJobMap: React.Dispatch<React.SetStateAction<Map<string, MediaJob>>>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chat, setChat] = useState<Message[]>([]);
  const [jobMap, setJobMap] = useState<Map<string, MediaJob>>(new Map());

  return (
    <AppContext.Provider
      value={{
        chat,
        jobMap,
        setChat,
        setJobMap,
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
