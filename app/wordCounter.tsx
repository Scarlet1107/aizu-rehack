"use client";
import Header from "@/components/word-counter/Header";
import { useState, useEffect } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/lib/use-mobile";
import { Loader2 } from "lucide-react";
import { ChatProps } from "./pokemon";
import { TextProvider } from "@/components/word-counter/TextContext";
import LeftPanel from "@/components/word-counter/LeftPanel";
import RightPanel from "@/components/word-counter/RightPanel";

export default function WordCounter({
    transitionToNextApp,
    chatHistory,
    message,
    setMessage,
    isLoading,
    sendMessage,
    remainingChats,
    opponent,
}: ChatProps) {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    const checkMobile = useIsMobile();

    useEffect(() => {
        setIsMobile(checkMobile);
    }, [checkMobile]);


    // 初回のサーバーサイド描画では、空の要素を返す
    if (isMobile === null) {
        return (
            <div className="flex justify-center space-x-4 items-center h-screen w-screen">
                <Loader2 className="animate-spin" />
                <h2 className="text-xl">ローディング中...</h2>
            </div>
        );
    }
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <TextProvider>
                {isMobile ? (
                    <Tabs defaultValue="counter" className="px-4">
                        <TabsContent
                            value="counter"
                            forceMount
                            className="data-[state=inactive]:hidden w-full h-full"
                        >
                            <LeftPanel />
                        </TabsContent>
                        <TabsContent
                            value="chat"
                            forceMount
                            className="data-[state=inactive]:hidden"
                        >
                            <RightPanel
                                transitionToNextApp={transitionToNextApp}
                                chatHistory={chatHistory}
                                message={message}
                                setMessage={setMessage}
                                isLoading={isLoading}
                                sendMessage={sendMessage}
                                remainingChats={remainingChats}
                                opponent={opponent}
                            />
                        </TabsContent>
                        <TabsList className="w-full grid grid-cols-2 mt-4 fixed bottom-1 left-0">
                            <TabsTrigger value="counter">文字数カウント</TabsTrigger>
                            <TabsTrigger value="chat">AIチャット</TabsTrigger>
                        </TabsList>
                    </Tabs>
                ) : (
                    <div className="flex-1 overflow-hidden">
                        <ResizablePanelGroup direction="horizontal" className="h-full">
                            <ResizablePanel defaultSize={50} minSize={35}>
                                <LeftPanel />
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={50} minSize={35}>
                                <RightPanel
                                    transitionToNextApp={transitionToNextApp}
                                    chatHistory={chatHistory}
                                    message={message}
                                    setMessage={setMessage}
                                    isLoading={isLoading}
                                    sendMessage={sendMessage}
                                    remainingChats={remainingChats}
                                    opponent={opponent}
                                />
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>
                )}
            </TextProvider>
        </div>
    );
}
