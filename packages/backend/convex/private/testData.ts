import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api";

export const createTestData = mutation({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    // Create test contact sessions
    const contactSessions = [];
    
    for (let i = 1; i <= 3; i++) {
      const contactSessionId = await ctx.db.insert("contactSessions", {
        name: `Test User ${i}`,
        email: `test${i}@example.com`,
        organizationId: args.organizationId,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        metadata: {
          timezone: i === 1 ? "America/New_York" : i === 2 ? "Europe/London" : "Asia/Tokyo",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          language: "en-US",
        },
      });
      contactSessions.push(contactSessionId);
    }

    // Create test conversations
    const conversations = [];
    const statuses = ["unresolved", "escalated", "resolved"] as const;
    
    for (let i = 0; i < contactSessions.length; i++) {
      const { threadId } = await supportAgent.createThread(ctx, {
        userId: args.organizationId,
      });

      // Add initial assistant message
      await saveMessage(ctx, components.agent, {
        threadId,
        message: {
          role: "assistant",
          content: "Hello! How can I help you today?",
        },
      });

      // Add user message
      await saveMessage(ctx, components.agent, {
        threadId,
        message: {
          role: "user",
          content: `Hi, I need help with issue #${i + 1}. This is a test conversation.`,
        },
      });

      const conversationId = await ctx.db.insert("conversations", {
        contactSessionId: contactSessions[i],
        status: statuses[i],
        organizationId: args.organizationId,
        threadId,
      });
      
      conversations.push(conversationId);
    }

    return {
      message: `Created ${conversations.length} test conversations`,
      conversationIds: conversations,
      contactSessionIds: contactSessions,
    };
  },
});
