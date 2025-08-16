import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { resolveConversation } from "../tools/resolveConversation";
import { escalateConversation } from "../tools/escalateConversation";

const google = createGoogleGenerativeAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const supportAgent = new Agent(components.agent, {
  chat: google("gemini-1.5-flash"),
  instructions: `You are a customer support agent. Use "resolvedConversation" tool when user expresses finalization of the conversation. Use "escalateConversation" tool when user expresses frustration, or request a human explicity`,
});
