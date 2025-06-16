"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTextContext } from "./TextContext";

const RightPanel = () => {
  const { text } = useTextContext(); // 入力された文字列
  const prompt = `ユーザーは以下のテキストを書いています。あなたは以下の文章を書くことをサポートするためのAIです。その状況を踏まえたうえで質問に回答してください。また回答にはマークダウンなどは使用せず、可能な限り平文で回答してください。\`\`\`${text}\`\`\``;
  const [messages, setMessages] = useState<
    { user: string; bot: string | null }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 不要な "*" を削除する関数
  const cleanMessage = (message: string | null) => {
    if (!message) return "";
    return message.replace(/\*/g, ""); // "*" を削除
  };

  // const handleSend = async () => {
  //   if (!input.trim() || isLoading) return;

  //   const userMessage = input.trim();
  //   setMessages((prev) => [...prev, { user: userMessage, bot: null }]);
  //   setInput("");
  //   setIsLoading(true);

  //   try {
  //     const trimmedMessages = messages.slice(-MAX_HISTORY); // 過去のメッセージを最大 MAX_HISTORY 件に制限
  //     const res = await fetch("/api/chat", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         messages: [
  //           { role: "system", content: prompt }, // システムメッセージを先頭に追加
  //           ...trimmedMessages.map((msg) => ({
  //             role: "user",
  //             content: msg.user,
  //           })),
  //           { role: "user", content: userMessage }, // ユーザーの現在の入力
  //         ],
  //       }),
  //     });

  //     if (!res.ok) {
  //       console.error("Failed to fetch response:", res);
  //       throw new Error("Failed to fetch response.");
  //     }

  //     const data = await res.json();
  //     setMessages((prev) => {
  //       const updatedMessages = [...prev];
  //       updatedMessages[updatedMessages.length - 1].bot = data.response;
  //       return updatedMessages;
  //     });
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setMessages((prev) => {
  //       const updatedMessages = [...prev];
  //       updatedMessages[updatedMessages.length - 1].bot =
  //         "エラーが発生しました。もう一度お試しください。";
  //       return updatedMessages;
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="h-full flex flex-col pt-8 md:pl-4">
      <div className="flex-1 min-h-0 overflow-y-auto md:pr-4 pb-16 md:pb-0">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="space-y-4">
              {msg.user && (
                <div className="flex justify-end">
                  <Card className="bg-blue-500 text-white">
                    <CardContent className="p-3">
                      <p className="break-words">{msg.user}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
              {msg.bot && (
                <div className="flex justify-start">
                  <div className="max-w-[80%]">
                    <Card className="bg-white">
                      <CardContent className="p-3">
                        <p className="break-words whitespace-pre-wrap text-gray-800">
                          {cleanMessage(msg.bot)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="bg-white w-24">
                <CardContent className="p-3 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                </CardContent>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <Separator className="mb-4" />

      <div className="fixed md:static bottom-8 right-2 md:flex-shrink-0 bg-white pb-4">
        <div className=" items-center gap-2 pr-4 flex">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            // onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="メッセージを入力してください..."
            className="flex-1"
          />
          <Button
            // onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 transition-colors"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="ml-2">送信</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
