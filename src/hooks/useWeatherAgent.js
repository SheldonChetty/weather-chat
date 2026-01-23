import { useState } from "react";
import { streamAgentResponse } from "../services/weatherAgentApi";

export default function useWeatherAgent() {
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  async function askAgent(prompt, onStream) {
    try {
      setIsTyping(true);
      setError(null);
      await streamAgentResponse(prompt, onStream);
    } catch (err) {
      setError("Failed to connect to weather agent");
    } finally {
      setIsTyping(false);
    }
  }

  return { askAgent, isTyping, error };
}
