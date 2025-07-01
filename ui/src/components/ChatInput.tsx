import { useRef } from "react";
import { ReactiveInput } from "./ReactiveInput";
import { ActionButton } from "./ActionButton";

interface ChatInputProps {
  userMessage: string;
  setUserMessage: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  onSend: (e: React.FormEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  userMessage,
  setUserMessage,
  loading,
  onSend,
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      onSubmit={onSend}
      className="bg-white/90 border border-[#E3E8F6] rounded-2xl shadow-lg px-4 py-2"
    >
      <div className="flex flex-row items-end gap-2 py-3">
        <ReactiveInput
          styles="flex-grow text-[#002FA7] max-h-256"
          autoComplete="off"
          value={userMessage}
          disabled={loading}
          placeholder="Type your question or instruction…"
          onChange={(e) => setUserMessage(e.target.value)}
          onSubmit={() => formRef.current?.requestSubmit?.()}
        />
        <ActionButton
          text="🧠"
          hint="Send"
          styles="rounded-xl bg-white/90 text-white font-bold hover:bg-[#EBEDFA] disabled:opacity-50"
          disabled={loading || !userMessage}
        />
      </div>
    </form>
  );
};
