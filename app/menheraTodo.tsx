"use client";
import React from "react";
import HeraMessage from "@/components/menheraTodo/heraMessage";
import { AffectionBadge } from "@/components/menheraTodo/affectionBadge";
import HeraMainImage from "@/components/menheraTodo/heraMainImage";
import { HeraProvider, HeraStatus } from "@/lib/menheraTodo/context";
import DynamicBackground from "@/components/menheraTodo/DynamicBackground";
import Header from "@/components/menheraTodo/heraHeader";
import { Toaster } from "sonner";
import { MobileNavigation } from "@/components/menheraTodo/mobileNavigation";

// Shadcn UI components
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";

const MenheraTodo = () => {
    const status: HeraStatus = {
        affection: 39,
        mood: "非常に悪い",
        event: "very_long_gap",
        delta: 0,
        message:
            "わたしのこと好きじゃないの？嫌いになっちゃった？面倒くさいしもう会いたくないんでしょ",
    };

    return (
        <HeraProvider status={status}>
            <main className="min-h-screen flex flex-col items-center">
                <div className="w-full h-14 shadow-sm flex items-center justify-end">
                    <Header />
                </div>
                <DynamicBackground />
                <div className="z-10 min-w-0 w-full pt-4 flex-1 flex flex-col">
                    {/* ヘラちゃんのメッセージ部分 */}
                    <div className="mx-4 flex-1">
                        <HeraMessage />
                    </div>
                    {/* 好感度バッジ */}
                    <div className="fixed right-4 bottom-40 md:bottom-56 md:right-20">
                        <AffectionBadge />
                    </div>
                    {/* メインイメージ */}
                    <HeraMainImage />

                    {/* PC: 入力エリア */}
                    <div className="hidden md:flex justify-center w-full py-4">
                        <Card className="w-full max-w-md">
                            <CardHeader>
                                <CardTitle>ヘラちゃんに何を送る？</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Input placeholder="メッセージを入力" />
                            </CardContent>
                            <CardFooter>
                                <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                                    送信
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Mobile: ダイアログ入力 */}
                    <div className="md:hidden">
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="fixed right-4 bottom-20 md:bottom-28 md:right-20 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-16 h-16 md:w-20 md:h-20 items-center text-center flex justify-center shadow-lg transition-all duration-200 ease-in-out">
                                    <Mail className="w-8 h-8 text-pink-50 font-bold" />
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>ヘラちゃんにメッセージを送る</DialogTitle>
                                </DialogHeader>
                                <Input placeholder="メッセージを入力" className="w-full mb-4" />
                                <DialogFooter>
                                    <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                                        送信
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </main>

            <MobileNavigation isHard={false} />
            <Toaster />
        </HeraProvider>
    );
};

export default MenheraTodo;
