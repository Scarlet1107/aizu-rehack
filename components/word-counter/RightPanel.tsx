"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ChatProps } from "@/app/pokemon";

const RightPanel = ({ transitionToNextApp, chatHistory, message, setMessage, isLoading, sendMessage, remainingChats, opponent }: ChatProps) => {
  // const [messages, setMessages] = useState<
  //   { user: string; bot: string | null }[]
  // >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // 不要な "*" を削除する関数
  const cleanMessage = (message: string | null) => {
    if (!message) return "";
    return message.replace(/\*/g, ""); // "*" を削除
  };
  return (
    <div className="h-full flex flex-col pt-8 md:pl-4">
      <div className="flex-1 min-h-0 overflow-y-auto md:pr-4 pb-16 md:pb-0">
        <div className="space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={msg.id} className="space-y-4">
              {index % 2 === 0 ? (
                // 偶数番なら右寄せ（プレイヤー側）
                <div className="flex justify-end">
                  <Card className="bg-blue-500 text-white">
                    <CardContent className="p-3 break-words">
                      {msg.text}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                // 奇数番なら左寄せ（オポーネント側）
                <div className="flex justify-start">
                  <div className="max-w-[80%]">
                    <Card className="bg-white">
                      <CardContent className="p-3 break-words whitespace-pre-wrap text-gray-800">
                        {cleanMessage(msg.text)}
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            // onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="メッセージを入力してください..."
            className="flex-1"
          />
          <Button
            onClick={() => sendMessage()}
            className="bg-blue-500 hover:bg-blue-600 transition-colors"
            disabled={isLoading || !message.trim()}
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
