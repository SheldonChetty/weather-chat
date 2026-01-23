export async function streamAgentResponse(prompt, onChunk) {
    const response = await fetch(
      "https://api-dev.provue.ai/api/webapp/agent/test-agent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          stream: true
        })
      }
    );
  
    if (!response.body) {
      throw new Error("Streaming not supported");
    }
  
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
  
    let buffer = "";
    let finalText = "";
  
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
  
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();
  
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
  
        const jsonStr = line.replace("data:", "").trim();
        if (!jsonStr) continue;
  
        try {
          const payload = JSON.parse(jsonStr);
  
          // ✅ handle multiple possible formats
          const content =
            payload?.payload?.content ||
            payload?.content ||
            payload?.delta?.content;
  
          if (typeof content === "string" && content.length > 0) {
            finalText += content;
            onChunk(finalText);
          }
        } catch {
          // ignore non-JSON chunks
        }
      }
    }
  
    // ✅ FALLBACK if agent sent no usable text
    if (!finalText) {
      finalText =
        "Sorry, I couldn’t fetch the weather details right now. Please try again.";
      onChunk(finalText);
    }
  
    return finalText;
  }
  