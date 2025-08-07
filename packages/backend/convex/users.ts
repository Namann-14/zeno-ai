import { query, mutation } from "./_generated/server";
export const getMany = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const add = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity == null) {
      throw new Error("Not Authenticated");
    }
    const orgID = identity.orgID as string;

    if (!orgID) {
      throw new Error("Missing Organization");
    }
    const userID = await ctx.db.insert("users", {
      name: "John Doe",
    });
    return userID;
  },
});
