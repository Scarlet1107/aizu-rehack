'use client';

import { useState } from 'react';
import PokemonChat from './pokemon';
import MenheraTodo from './menheraTodo';

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'player' | 'opponent';
}

type AppTypes = 'pokemon' | 'menheraTodo';
const apps: AppTypes[] = ['pokemon', 'menheraTodo'];

export default function Home() {
  const [currentApp, setCurrentApp] = useState<AppTypes>(apps[0]);
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

  const transitionToNextApp = () => {
    const randIdx = Math.floor(Math.random() * (apps.length - 1));
    const currentIdx = apps.indexOf(currentApp);
    const nextApps = [
      ...apps.slice(0, currentIdx),
      ...apps.slice(currentIdx + 1),
    ];
    setCurrentApp(nextApps[randIdx]);
    setChatHistory([]);
  };

  return (
    <main>
      {currentApp === 'pokemon' && (
        <PokemonChat
          message={message}
          setMessage={setMessage}
          isLoading={isLoading}
          chatHistory={chatHistory}
          sendMessage={sendMessage}
          transitionToNextApp={transitionToNextApp}
        />
      )}
      {currentApp === 'menheraTodo' && (
        <MenheraTodo
          transitionToNextApp={transitionToNextApp}
          chatHistory={chatHistory}
        />
      )}
    </main>
  );
}
