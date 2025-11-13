#!/usr/bin/env -S deno run --allow-net --allow-env --allow-read
/**
 * Phi3 Mini + ConsoleStyler Integration
 * Stream model output through your professional ConsoleStyler logger.
 */

import { ConsoleStylerLogger } from "./adapters/ConsoleStylerLogger.ts";

const logger = new ConsoleStylerLogger();

// Example Ollama streaming client
async function runPhi3Mini(prompt: string) {
  const url = "http://localhost:11434/api/generate";
  const body = JSON.stringify({
    model: "phi3:mini",
    prompt,
    stream: true,
  });

  const resp = await fetch(url, {
    method: "POST",
    body,
  });

  if (!resp.body) {
    logger.logError("No response body from Ollama server");
    return;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();

  logger.logSection("💬 Phi-3 Mini Streaming Output", "cyan", "heavy");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    for (const line of chunk.split("\n")) {
      if (!line.trim()) continue;
      try {
        const data = JSON.parse(line);
        if (data.response) {
          logger.logInfo(data.response.trim());
        }
      } catch {
        logger.logWarning("Malformed chunk", { line });
      }
    }
  }

  logger.logSuccess("✅ Generation complete");
}

await runPhi3Mini("Explain the Unix philosophy in one paragraph.");
