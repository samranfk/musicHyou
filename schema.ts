import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  currencies: defineTable({
    name: v.string(), // e.g., "US Dollar", "Bitcoin"
    symbol: v.string(), // e.g., "USD", "BTC"
    type: v.union(v.literal("fiat"), v.literal("digital")), // Type of currency
  }).index("by_symbol", ["symbol"]),

  exchangeRates: defineTable({
    currencyId: v.id("currencies"), // Foreign key to currencies table
    targetCurrencySymbol: v.string(), // e.g., "IRR", "USD"
    rate: v.number(), // Exchange rate
    lastUpdated: v.number(), // Timestamp of the last update
  })
    .index("by_currencyId", ["currencyId"])
    .index("by_currencyId_and_target", ["currencyId", "targetCurrencySymbol"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
