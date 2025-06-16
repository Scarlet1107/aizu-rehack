"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Context の型を定義
interface TextContextProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}

// Context を作成
const TextContext = createContext<TextContextProps | undefined>(undefined);

// Provider コンポーネントを作成
export const TextProvider = ({ children }: { children: ReactNode }) => {
  const [text, setText] = useState<string>("");

  return (
    <TextContext.Provider value={{ text, setText }}>
      {children}
    </TextContext.Provider>
  );
};

// カスタムフックを作成
export const useTextContext = () => {
  const context = useContext(TextContext);
  if (!context) {
    throw new Error("useTextContext must be used within a TextProvider");
  }
  return context;
};
