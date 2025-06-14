'use client';

import { useState } from 'react';
import PokemonChat from './pokemon';

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'player' | 'opponent';
}

export default function Home() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const sendMessage = () => {
    setIsLoading(true);
    setChatHistory((prev) => [
      ...prev,
      { id: prev.length + 1, text: message, sender: 'player' },
    ]);
    setMessage('');

    setTimeout(() => {
      setIsLoading(false);
      setChatHistory((prev) => [
        ...prev,
        { id: prev.length + 1, text: 'どうする？', sender: 'opponent' },
      ]);
    }, 1000);
  };

  return (
    <main>
      <PokemonChat
        message={message}
        setMessage={setMessage}
        isLoading={isLoading}
        chatHistory={chatHistory}
        sendMessage={sendMessage}
      />
    </main>
  );
}
