"use client";

import { useSession } from "next-auth/react";

export function SessionInfo() {
  const { data: session, status } = useSession();

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2 className="font-bold mb-2">Session Debug Info</h2>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify({ session, status }, null, 2)}
      </pre>
    </div>
  );
}
