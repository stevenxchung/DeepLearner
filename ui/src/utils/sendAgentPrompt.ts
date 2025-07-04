import type { AgentRequest, Message } from "../types";

const AGENT_API_URL = `${import.meta.env.VITE_AGENT_ORX_API_URL}/api`;

export async function sendAgentPrompt(
  e: React.FormEvent,
  {
    filename,
    userMessage,
    setChat,
    setLoading,
    setAgentTyping,
    setUserMessage,
  }: {
    filename: string;
    userMessage: string;
    setChat: React.Dispatch<React.SetStateAction<Message[]>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setAgentTyping: React.Dispatch<React.SetStateAction<string | null>>;
    setUserMessage: React.Dispatch<React.SetStateAction<string>>;
  }
) {
  e.preventDefault();
  if (!userMessage) return; // Only require userMessage

  setChat((prev) => [...prev, { role: "user", content: userMessage }]);
  setLoading(true);
  setAgentTyping(""); // Start streaming reply

  // Clear user input
  setUserMessage("");

  try {
    const request: AgentRequest = { filename, message: userMessage };
    const response = await fetch(`${AGENT_API_URL}/agent-stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.body) throw new Error("No response body from agent");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let agentReply = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      agentReply += decoder.decode(value, { stream: true });
      setAgentTyping(agentReply);
    }

    setChat((prev) => [...prev, { role: "agent", content: agentReply }]);
    setAgentTyping(null);
  } catch (err) {
    setChat((prev) => [
      ...prev,
      { role: "agent", content: `[Agent error: ${err}]` },
    ]);
    setAgentTyping(null);
  }
  setLoading(false);
}
