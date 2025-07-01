import { MarkdownMessage } from "./MarkdownMessage";

interface ChatMessagesProps {
  chat: { role: string; content: string }[];
  agentTyping: string | null;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  chat,
  agentTyping,
}) => (
  <div className="w-full max-w-3xl mx-auto">
    {chat.map((msg, idx) => (
      <div
        key={idx}
        className={`flex ${
          msg.role === "user" ? "justify-end" : "justify-start"
        } mb-3`}
      >
        <div
          className={`prose prose-sm max-w-xl px-5 py-3 rounded-xl shadow
          ${
            msg.role === "user"
              ? "bg-[#EBEDFA] text-[#002FA7]"
              : "bg-green-100 border border-[#E3E8F6] text-gray-900"
          }
          whitespace-pre-wrap`}
        >
          <MarkdownMessage content={msg.content} />
        </div>
      </div>
    ))}
    {agentTyping !== null && (
      <div className="my-2 flex justify-start">
        <div className="max-w-xl rounded-lg px-4 py-3 bg-green-100 text-green-900 animate-pulse">
          <MarkdownMessage content={agentTyping} className="prose prose-sm" />
        </div>
      </div>
    )}
  </div>
);
