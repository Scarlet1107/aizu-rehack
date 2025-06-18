'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

// アプリごとのチャット上限回数
const chatLimits: Record<AppTypes, number> = {
  pokemon: 3,
  menheraTodo: 5,
  wordCounter: 2,
};

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

// 配列をシャッフルするユーティリティ
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Home() {
  // 初回レンダリング時にアプリの順序をランダムに決定
  const appOrder = useMemo(() => shuffleArray(apps), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentApp = appOrder[currentIndex];

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [opponentIdx, setOpponentIdx] = useState<number | null>(null);
  const [remainingChats, setRemainingChats] = useState<number>(
    chatLimits[currentApp]
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 初回レンダリングでランダムに相手を決定
  useEffect(() => {
    setOpponentIdx(
      Math.floor(Math.random() * Object.keys(opponents).length)
    );
  }, []);

  // currentApp が変わるたびにタイマーと残チャット回数をリセット
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRemainingChats(chatLimits[currentApp]);
    timerRef.current = setTimeout(() => {
      transitionToNextApp();
    }, 180 * 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentApp]);

  // メッセージ送信
  const sendMessage = async () => {
    if (message.trim() === '' || isLoading) return;

    // 送信前に残チャットを計算しておく
    let nextRem = remainingChats - 1;
    setRemainingChats(nextRem);

    setIsLoading(true);
    setChatHistory((prev) => [
      ...prev,
      { id: prev.length + 1, text: message, sender: 'player' },
    ]);

    try {
      if (opponentIdx === null) return;
      const opponentKey = Object.keys(opponents)[
        opponentIdx
      ] as keyof typeof opponents;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, opponent: opponentKey }),
      });
      const data = await res.json();

      const replyText = res.ok
        ? data.response || 'すみません、返答を生成できませんでした。'
        : `エラー: ${getJapaneseErrorMessage(data.error || '')}`;

      setChatHistory((prev) => [
        ...prev,
        { id: prev.length + 1, text: replyText, sender: 'opponent' },
      ]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        { id: prev.length + 1, text: 'エラーだぽよ。', sender: 'opponent' },
      ]);
    } finally {
      setMessage('');
      setIsLoading(false);

      // AIレスポンス後、残チャットが 0 なら5秒後に切り替え
      if (nextRem !== undefined && nextRem <= 0) {
        setTimeout(() => {
          transitionToNextApp();
        }, 5000);
      }
    }
  };

  // menheraTodo に切り替わったら相手をヘラちゃんに
  useEffect(() => {
    if (currentApp === 'menheraTodo') {
      const idx = Object.keys(opponents).indexOf('hera');
      setOpponentIdx(idx);
    }
  }, [currentApp]);

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

  // 次のアプリへ切り替え
  const transitionToNextApp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    // order に従って次の index へ
    setCurrentIndex((prev) => (prev + 1) % appOrder.length);
    setChatHistory([]);
  };

  if (opponentIdx === null) {
    return <div>Loading...</div>;
  }

  const commonProps = {
    opponent: Object.values(opponents)[opponentIdx],
    message,
    setMessage,
    isLoading,
    chatHistory,
    sendMessage,
    transitionToNextApp,
    remainingChats,
  };

  return (
    <main>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentApp}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentApp === 'pokemon' && <PokemonChat {...commonProps} />}
          {currentApp === 'menheraTodo' && <MenheraTodo {...commonProps} />}
          {currentApp === 'wordCounter' && <WordCounter {...commonProps} />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
