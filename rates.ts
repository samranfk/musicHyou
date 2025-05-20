import { query } from "./_generated/server";
import { v } from "convex/values";

// Example data structure - we will replace this with actual API calls later
const exampleRates = [
  {
    _id: "1",
    name: "US Dollar",
    symbol: "USD",
    type: "fiat" as const,
    rates: [
      { targetSymbol: "IRR", rate: 420000, lastUpdated: Date.now() },
      { targetSymbol: "USD", rate: 1, lastUpdated: Date.now() },
    ],
  },
  {
    _id: "2",
    name: "Bitcoin",
    symbol: "BTC",
    type: "digital" as const,
    rates: [
      { targetSymbol: "USD", rate: 60000, lastUpdated: Date.now() },
      { targetSymbol: "IRR", rate: 60000 * 420000, lastUpdated: Date.now() },
    ],
  },
  {
    _id: "3",
    name: "Ethereum",
    symbol: "ETH",
    type: "digital" as const,
    rates: [
      { targetSymbol: "USD", rate: 3000, lastUpdated: Date.now() },
      { targetSymbol: "IRR", rate: 3000 * 420000, lastUpdated: Date.now() },
    ],
  },
  {
    _id: "4",
    name: "Iranian Rial", // For completeness, though it's a target
    symbol: "IRR",
    type: "fiat" as const,
    rates: [
      { targetSymbol: "USD", rate: 1 / 420000, lastUpdated: Date.now() },
      { targetSymbol: "IRR", rate: 1, lastUpdated: Date.now() },
    ],
  },
];

export const listRates = query({
  args: {},
  handler: async (ctx) => {
    // In a real app, you would fetch from ctx.db.query("currencies")
    // and then join with ctx.db.query("exchangeRates")
    // For now, we return example data.
    // This data is for UI rendering purposes and is not stored in the database yet.
    return exampleRates.map(currency => ({
      _id: currency._id, // This will be a proper Id<"currencies"> later
      _creationTime: Date.now(), // This will be a proper _creationTime later
      name: currency.name,
      symbol: currency.symbol,
      type: currency.type,
      // Simulate fetching related exchange rates
      exchangeRates: currency.rates.map(rate => ({
        _id: Math.random().toString(36).substring(7), // This will be a proper Id<"exchangeRates"> later
        _creationTime: Date.now(), // This will be a proper _creationTime later
        currencyId: currency._id, // This will be a proper Id<"currencies"> later
        targetCurrencySymbol: rate.targetSymbol,
        rate: rate.rate,
        lastUpdated: rate.lastUpdated,
      }))
    }));
  },
});

// We will add mutations to add/update currencies and rates later.
// We will also add an action to fetch real data from an API.
