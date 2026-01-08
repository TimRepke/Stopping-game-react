import React, { createContext, useEffect, useState } from "react";

type UserIdContextValue = {
  userId: string | null;
  isReady: boolean;
};

const UserIdContext = createContext<UserIdContextValue | undefined>(undefined);

const STORAGE_KEY = "anonymous_user_id";

function getOrCreateUserId(): string {
  let id = localStorage.getItem(STORAGE_KEY);

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }

  return id;
}

export const UserIdProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = getOrCreateUserId();
    setUserId(id);
  }, []);

  return (
    <UserIdContext.Provider
      value={{
        userId,
        isReady: userId !== null,
      }}
    >
      {children}
    </UserIdContext.Provider>
  );
};