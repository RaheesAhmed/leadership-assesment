"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface SubscriptionStatus {
  id: string;
  plan_type: string;
  status: string;
  end_date: string;
}

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus | null;
  isLoading: boolean;
  error: string | null;
  checkSubscription: () => Promise<void>;
  createSubscription: (planType: string, endDate: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const checkSubscription = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/subscriptions/status`,
        {
          headers: {
            Authorization: `Bearer ${user?.email}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch subscription status");

      const data = await response.json();
      setSubscriptionStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (planType: string, endDate: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/subscriptions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.email}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ planType, endDate }),
        }
      );

      if (!response.ok) throw new Error("Failed to create subscription");

      await checkSubscription();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionStatus,
        isLoading,
        error,
        checkSubscription,
        createSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
}
