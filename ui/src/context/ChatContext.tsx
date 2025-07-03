import React, { createContext, useContext, useState } from "react";
import type { Message } from "../types";

type ChatContextType = {
  chat: Message[];
  setChat: React.Dispatch<React.SetStateAction<Message[]>>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chat, setChat] = useState<Message[]>([]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        setChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
};
