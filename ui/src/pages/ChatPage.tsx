import { useState, useRef, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useTextFiles } from "../hooks/useTextFiles";
import { sendAgentPrompt } from "../utils/sendAgentPrompt";

export const ChatPage: React.FC = () => {
  const { chat, setChat } = useAppContext();
  const [filename, setFilename] = useState(""); // Optional
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [agentTyping, setAgentTyping] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { files, loading: filesLoading, error: filesError } = useTextFiles();

  // Scroll chat to bottom on new message or streaming
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [chat, agentTyping]);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl mb-4 font-bold text-emerald-500 flex items-center gap-2">
        🤖 GPT Agent Chat
      </h1>

      <div
        className="w-full border rounded bg-white shadow p-4"
        style={{ minHeight: "24rem", maxHeight: "32rem", overflow: "auto" }}
      >
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-3 py-1 rounded ${
                msg.role === "user" ? "bg-blue-100" : "bg-green-100"
              } whitespace-pre-wrap`}
            >
              <b>{msg.role === "user" ? "You" : "Agent"}:</b> {msg.content}
            </div>
          </div>
        ))}
        {agentTyping !== null && (
          <div className="mb-2 text-left">
            <div className="inline-block px-3 py-1 rounded bg-green-100 whitespace-pre-wrap animate-pulse">
              <b>Agent:</b> {agentTyping}
            </div>
          </div>
        )}
        <textarea ref={textareaRef} className="hidden" readOnly />
      </div>

      <form
        onSubmit={(e) =>
          sendAgentPrompt(e, {
            filename,
            userMessage,
            setChat,
            setLoading,
            setAgentTyping,
            setUserMessage,
          })
        }
        className="w-full flex gap-2 mt-6"
      >
        {/* Filename dropdown, optional value */}
        {filesLoading ? (
          <select
            className="flex-1 border px-3 py-2 rounded bg-gray-100"
            disabled
          >
            <option>Loading files…</option>
          </select>
        ) : filesError ? (
          <select
            className="flex-1 border px-3 py-2 rounded bg-red-100"
            disabled
          >
            <option>{filesError}</option>
          </select>
        ) : (
          <select
            className="flex-1 border px-3 py-2 rounded"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            disabled={loading}
          >
            <option value="">(No file)</option>
            {files.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        )}

        <input
          className="flex-[2] border px-3 py-2 rounded"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your question or instruction"
          required
          disabled={loading}
        />
        <button
          className={`bg-green-600 text-white rounded px-4 py-2 disabled:opacity-50`}
          type="submit"
          disabled={loading || !userMessage}
        >
          Send
        </button>
      </form>
    </div>
  );
};
