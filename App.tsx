import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { ExchangeRateDisplay } from "./ExchangeRateDisplay"; // Import the new component

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-slate-200">
        <h2 className="text-xl font-semibold text-indigo-600">Currency Exchange</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Authenticated>
        <div className="text-center mb-4">
          <p className="text-lg text-slate-700">
            Welcome, {loggedInUser?.email ?? "friend"}!
          </p>
          <p className="text-sm text-slate-500">View current exchange rates below.</p>
        </div>
        <ExchangeRateDisplay />
      </Authenticated>
      <Unauthenticated>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">Cook with Chef</h1>
          <p className="text-xl text-slate-600">Sign in to view exchange rates.</p>
        </div>
        <SignInForm />
      </Unauthenticated>
    </div>
  );
}
