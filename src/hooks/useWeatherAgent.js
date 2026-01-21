export function useWeatherAgent() {
  async function sendMessageToAgent(message) {
    const response = await fetch(
      "https://brief-thousands-sunset-9fcb1c78-485f-4967-ac04-27599a8fa1462.mastra.cloud/api/agents/weatherAgent/stream",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mastra-dev-playground": "true"
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: message }],
          runId: "weatherAgent",
          threadId: "222017"
        })
      }
    );

    const text = await response.text();
    return text || "No response from agent.";
  }

  return { sendMessageToAgent };
}
