import React, { createContext, useContext, useState } from "react";
import type { MediaJob, Message } from "../types";

type AppContextValue = {
  chat: Message[];
  setChat: React.Dispatch<React.SetStateAction<Message[]>>;
  jobs: MediaJob[];
  setJobs: React.Dispatch<React.SetStateAction<MediaJob[]>>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chat, setChat] = useState<Message[]>([]);
  const [jobs, setJobs] = useState<MediaJob[]>([]);
  return (
    <AppContext.Provider value={{ chat, setChat, jobs, setJobs }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const value = useContext(AppContext);
  if (!value) throw new Error("useAppContext must be used within AppProvider");
  return value;
};
