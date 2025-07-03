import { useState } from "react";
import { useChatContext } from "../context/ChatContext";
import { sendAgentPrompt } from "../utils/sendAgentPrompt";
import { ChatMessages } from "../components/ChatMessages";
import { ChatInput } from "../components/ChatInput";
import { useFileContext } from "../context/FileContext";

export const ChatPage: React.FC = () => {
  const { chat, setChat } = useChatContext();
  const { selectedFile } = useFileContext();
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentTyping, setAgentTyping] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-[#FDFEFF]">
      <main className="flex flex-col flex-1 h-screen relative bg-[#FDFEFF] ">
        <div className="flex-1 overflow-y-auto px-2 md:px-8 pt-8 pb-4">
          <ChatMessages chat={chat} agentTyping={agentTyping} />
        </div>
        <div className="px-2 md:px-8 pb-10">
          <ChatInput
            loading={loading}
            userMessage={userMessage}
            setUserMessage={setUserMessage}
            onSend={(e) =>
              sendAgentPrompt(e, {
                filename: selectedFile,
                userMessage,
                setChat,
                setLoading,
                setAgentTyping,
                setUserMessage,
              })
            }
          />
        </div>
      </main>
    </div>
  );
};
