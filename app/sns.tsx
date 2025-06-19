import React, { FormEvent } from 'react';
import { ChatMessage } from './page';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SocialFeedProps {
    opponent: {
        name: string;
        sprite: string;
    };
    message: string;
    setMessage: (msg: string) => void;
    isLoading: boolean;
    chatHistory: ChatMessage[];
    sendMessage: () => Promise<void>;
    transitionToNextApp: () => void;
    remainingChats: number;
}

export default function SocialFeed({
    opponent,
    message,
    setMessage,
    isLoading,
    chatHistory,
    sendMessage,
    transitionToNextApp,
    remainingChats,
}: SocialFeedProps) {
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await sendMessage();
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Top Bar */}
            <div className="flex items-center px-4 py-2 border-b">
                <h1 className="text-xl font-bold text-blue-500">Twitter</h1>
                <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto"
                    onClick={transitionToNextApp}
                >
                    🔄
                </Button>
            </div>

            {/* Feed */}
            <ScrollArea className="flex-1">
                <div className="space-y-4 p-4">
                    {chatHistory.map((msg) => (
                        <Card key={msg.id} className="shadow-sm">
                            <CardContent className="flex space-x-3">
                                <Avatar>
                                    <img src={
                                        msg.sender === 'player' ? '/player-avatar.png' : opponent.sprite
                                    } alt="avatar" />
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-gray-900">
                                            {msg.sender === 'player' ? 'You' : opponent.name}
                                        </span>
                                        <span className="text-sm text-gray-500">@{msg.sender === 'player' ? 'you' : opponent.name.toLowerCase()}</span>
                                    </div>
                                    <p className="mt-1 text-gray-800 whitespace-pre-wrap">
                                        {msg.text}
                                    </p>
                                    <div className="mt-2 flex space-x-6 text-sm text-gray-500">
                                        <button>💬 Reply</button>
                                        <button>🔁 Retweet</button>
                                        <button>❤️ Like</button>
                                        <button>🔖 Bookmark</button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>

            {/* Composer */}
            <div className="border-t p-4">
                <form onSubmit={onSubmit} className="flex items-start space-x-3">
                    <Avatar>
                        <img src="/player-avatar.png" alt="You" />
                    </Avatar>
                    <div className="flex-1">
                        <Input
                            placeholder={`今どうしてる？`}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={isLoading || remainingChats <= 0}
                        />
                        <div className="mt-2 flex justify-end">
                            <Button type="submit" disabled={isLoading || remainingChats <= 0}>
                                {isLoading ? '...' : 'ツイート'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
