'use client';

import { useEffect, useState } from 'react';
import PokemonChat from './pokemon';
import MenheraTodo from './menheraTodo';
import WordCounter from './wordCounter';

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'player' | 'opponent';
}

type AppTypes = 'pokemon' | 'menheraTodo' | 'wordCounter';
const apps: AppTypes[] = ['pokemon', 'menheraTodo', 'wordCounter'];

const opponents = {
  pokemon: {
    name: 'ゲッコウガ',
    level: 42,
    hp: 100,
    maxHp: 100,
    sprite: '/greninja.svg',
  },
  hera: {
    name: 'ヘラちゃん',
    level: 69,
    hp: 90,
    maxHp: 100,
    sprite: '/hera-chan/icon/bad.png',
  },
};

export default function Home() {
  const [currentApp, setCurrentApp] = useState<AppTypes>(apps[0]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [opponentIdx, setOpponentIdx] = useState<number | null>(null);

  useEffect(() => {
    setOpponentIdx(Math.floor(Math.random() * Object.keys(opponents).length));
  }, []);

  const sendMessage = async () => {
    if (message.trim() === '') {
      return;
    }

    setIsLoading(true);

    // Add user message to chat history
    setChatHistory((prev) => [
      ...prev,
      { id: prev.length + 1, text: message, sender: 'player' },
    ]);

    try {
      if (opponentIdx === null) {
        return;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          opponent: Object.keys(opponents)[opponentIdx],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API error responses
        const errorMessage = data.error || 'An unexpected error occurred';
        console.error('API Error:', errorMessage);

        // Add error message to chat history
        setChatHistory((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: `エラー: ${getJapaneseErrorMessage(errorMessage)}`,
            sender: 'opponent',
          },
        ]);
      } else {
        // Handle successful response
        if (data.response) {
          setChatHistory((prev) => [
            ...prev,
            { id: prev.length + 1, text: data.response, sender: 'opponent' },
          ]);
        } else {
          // Handle case where response is empty
          setChatHistory((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              text: 'すみません、返答を生成できませんでした。',
              sender: 'opponent',
            },
          ]);
        }
      }
    } catch (error) {
      // Handle network errors or other fetch failures
      console.error('Network Error:', error);
      setChatHistory((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: 'エラーだぽよ。',
          sender: 'opponent',
        },
      ]);
    } finally {
      setMessage('');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentApp === 'menheraTodo') {
      setOpponentIdx(Object.keys(opponents).indexOf('hera'));
    }
  }, [currentApp]);

  // Convert English error messages to Japanese for better UX
  const getJapaneseErrorMessage = (errorMessage: string): string => {
    const errorMap: Record<string, string> = {
      'API configuration error': 'API設定エラーです',
      'Invalid request format': '無効なリクエスト形式です',
      'Message is required and must be a non-empty string':
        'メッセージを入力してください',
      'Message is too long (max 10000 characters)':
        'メッセージが長すぎます（最大10000文字）',
      'Failed to generate response': '返答の生成に失敗しました',
      'Authentication failed': '認証に失敗しました',
      'Service temporarily unavailable': 'サービスが一時的に利用できません',
      'Network error, please try again':
        'ネットワークエラーです。もう一度お試しください',
      'An unexpected error occurred': '予期しないエラーが発生しました',
    };

    return errorMap[errorMessage] || errorMessage;
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

  if (opponentIdx === null) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      {currentApp === 'pokemon' && (
        <PokemonChat
          opponent={Object.values(opponents)[opponentIdx]}
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
          opponent={Object.values(opponents)[opponentIdx]}
          message={message}
          setMessage={setMessage}
          isLoading={isLoading}
          chatHistory={chatHistory}
          sendMessage={sendMessage}
          transitionToNextApp={transitionToNextApp}
        />
      )}
      {currentApp === 'wordCounter' && (
        <WordCounter
          opponent={Object.values(opponents)[opponentIdx]}
          message={message}
          setMessage={setMessage}
          isLoading={isLoading}
          chatHistory={chatHistory}
          sendMessage={sendMessage}
          transitionToNextApp={transitionToNextApp}
        />
      )}
    </main>
  );
}
