import React, { useState } from 'react';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

interface Rate {
  _id: string; // Will be Id<"exchangeRates">
  _creationTime: number;
  currencyId: string; // Will be Id<"currencies">
  targetCurrencySymbol: string;
  rate: number;
  lastUpdated: number;
}

interface CurrencyWithRates {
  _id: string; // Will be Id<"currencies">
  _creationTime: number;
  name: string;
  symbol: string;
  type: "fiat" | "digital";
  exchangeRates: Rate[];
}

export function ExchangeRateDisplay() {
  const ratesData = useQuery(api.rates.listRates) || [];
  const [amount, setAmount] = useState<number>(1);
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState<string>("USD");

  if (ratesData.length === 0) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        <p className="ml-2">Loading exchange rates...</p>
      </div>
    );
  }

  const selectedCurrency = ratesData.find(c => c.symbol === selectedCurrencySymbol);
  const rateToUSD = selectedCurrency?.exchangeRates.find(r => r.targetCurrencySymbol === "USD")?.rate || 1;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-indigo-600">Exchange Rates</h2>
      
      <div className="mb-6 p-4 border rounded-md bg-slate-50">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1">
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter amount"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="currency" className="block text-sm font-medium text-slate-700 mb-1">
              From Currency
            </label>
            <select
              id="currency"
              value={selectedCurrencySymbol}
              onChange={(e) => setSelectedCurrencySymbol(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              {ratesData.map((currency) => (
                <option key={currency.symbol} value={currency.symbol}>
                  {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
         <p className="text-xs text-slate-500 mt-2">
           Note: The rates displayed are example data for UI demonstration and are not live.
         </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Currency
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Rate (vs USD)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Rate (vs IRR)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Input Value in This Currency
              </th>
               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Input Value (USD)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Input Value (IRR)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {ratesData.map((currency) => {
              const inputInUSD = amount * rateToUSD;
              const calculatedValueInRowCurrency = inputInUSD / (currency.exchangeRates.find(r => r.targetCurrencySymbol === "USD")?.rate || 1);
              const usdToIrrRate = ratesData.find(c => c.symbol === "USD")?.exchangeRates.find(r => r.targetCurrencySymbol === "IRR")?.rate || 0;

              return (
                <tr key={currency.symbol} className={currency.symbol === selectedCurrencySymbol ? "bg-indigo-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{currency.name} ({currency.symbol})</div>
                    <div className="text-xs text-slate-500">{currency.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {(currency.exchangeRates.find(r => r.targetCurrencySymbol === "USD")?.rate || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: currency.type === 'digital' ? 2 : 5 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {(currency.exchangeRates.find(r => r.targetCurrencySymbol === "IRR")?.rate || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">
                    {calculatedValueInRowCurrency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: currency.type === 'digital' ? 8 : 2 })} {currency.symbol}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {inputInUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {(inputInUSD * usdToIrrRate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} IRR
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500 mt-4 text-center">
        Last updated: {new Date(Math.max(...ratesData.flatMap(c => c.exchangeRates.map(r => r.lastUpdated)))).toLocaleString()}
      </p>
    </div>
  );
}
