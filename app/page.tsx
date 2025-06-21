'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import BootSequence from '@/components/BootSequence';
import PokemonChat from './pokemon';
import MenheraTodo, { DEFAULT_HERA_MESSAGE } from './menheraTodo';
import WordCounter from './wordCounter';
import SocialFeed from './sns';

// ターミナルクライアントを動的インポート（WASM対応）
const DynamicTerminalClient = dynamic(
  () => import('@/components/TerminalClient'),
  {
    ssr: false,
    loading: () => (
      <div className='h-screen w-screen bg-black text-green-400 font-mono flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-4'></div>
          <p>Loading Terminal...</p>
        </div>
      </div>
    ),
  }
);

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'player' | 'opponent';
}

type AppTypes = 'pokemon' | 'menheraTodo' | 'wordCounter' | 'sns';
type SystemState = 'booting' | 'terminal' | 'gaming';

const apps: AppTypes[] = ['pokemon', 'menheraTodo', 'wordCounter', 'sns'];

// アプリごとのチャット上限回数
const chatLimits: Record<AppTypes, number> = {
  pokemon: 3,
  menheraTodo: 5,
  wordCounter: 2,
  sns: 3,
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
  arabicMystery: {
    name: '謎のアラビア語スピーカー',
    level: 50,
    hp: 100,
    maxHp: 100,
    sprite: '/arabic-mystery.png',
  },
  goku: {
    name: '孫悟空',
    level: 9001,
    hp: 200,
    maxHp: 200,
    sprite: '/goku.png',
  },
  salaryman: {
    name: '激務サラリーマン',
    level: 30,
    hp: 80,
    maxHp: 80,
    sprite: '/salaryman.png',
  },
  medievalKnight: {
    name: '中世の騎士',
    level: 45,
    hp: 120,
    maxHp: 120,
    sprite: '/medieval-knight.png',
  },
  pirateCaptain: {
    name: '海賊船長',
    level: 55,
    hp: 110,
    maxHp: 110,
    sprite: '/pirate-captain.png',
  },
  timeTraveler: {
    name: '時空の旅人',
    level: 75,
    hp: 130,
    maxHp: 130,
    sprite: '/time-traveler.png',
  },
  cyborgCat: {
    name: 'サイボーグ猫',
    level: 40,
    hp: 95,
    maxHp: 95,
    sprite: '/cyborg-cat.png',
  },
  phantomThiefGirl: {
    name: '怪盗ミス・ルパン',
    level: 60,
    hp: 105,
    maxHp: 105,
    sprite: '/phantom-thief-girl.png',
  },
  zombieOfficeWorker: {
    name: 'ゾンビ社員',
    level: 35,
    hp: 85,
    maxHp: 85,
    sprite: '/zombie-office-worker.png',
  },
  ghostTeacher: {
    name: '幽霊教師',
    level: 50,
    hp: 100,
    maxHp: 100,
    sprite: '/ghost-teacher.png',
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
  // システム状態管理
  const [systemState, setSystemState] = useState<SystemState>('booting');

  // ゲーム部分の状態（既存のロジック）
  const appOrder = useMemo(() => shuffleArray(apps), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const currentApp = apps[2]; // デバッグ用に固定
  const currentApp = appOrder[currentIndex];

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [opponentIdx, setOpponentIdx] = useState<number | null>(null);
  const [remainingChats, setRemainingChats] = useState<number>(
    chatLimits[currentApp]
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // boot完了時にターミナルに移行
  const handleBootComplete = () => {
    setSystemState('terminal');
  };

  // gamestartコマンドでゲームに移行
  const handleGameStart = () => {
    setSystemState('gaming');
  };

  // rebootコマンドでシステム再起動
  const handleReboot = () => {
    // 全ての状態をリセット
    setSystemState('booting');
    setChatHistory([]);
    setCurrentIndex(0);
    setMessage('');
    setOpponentIdx(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    setRemainingChats(chatLimits[currentApp]);
  };

  // 初回レンダリングでランダムに相手を決定 (ただしMenheraTodoは固定)
  useEffect(() => {
    if (systemState === 'gaming') {
      if (currentApp === 'menheraTodo') {
        setOpponentIdx(Object.keys(opponents).indexOf('hera'));
      } else {
        setOpponentIdx(
          Math.floor(Math.random() * Object.keys(opponents).length)
        );
      }
    }
  }, [currentApp, systemState]);

  // currentApp が変わるたびにタイマーと残チャット回数をリセット
  useEffect(() => {
    if (systemState === 'gaming') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setRemainingChats(chatLimits[currentApp]);
      timerRef.current = setTimeout(() => {
        transitionToNextApp();
      }, 60 * 1000);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [currentApp, systemState]);

  // メッセージ送信
  const sendMessage = async () => {
    if (message.trim() === '' || isLoading || remainingChats <= 0) return;

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

  // MenheraTodo表示時に初期チャットをセット
  useEffect(() => {
    if (systemState === 'gaming' && currentApp === 'menheraTodo') {
      setChatHistory([
        { id: 1, text: DEFAULT_HERA_MESSAGE, sender: 'opponent' },
      ]);
    }
  }, [currentApp, systemState]);

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

  // ターミナルからOSに戻る機能
  const handleBackToTerminal = () => {
    setSystemState('terminal');
    setChatHistory([]);
    setCurrentIndex(0);
  };

  // システム状態に応じた画面描画
  if (systemState === 'booting') {
    return <BootSequence onBootComplete={handleBootComplete} />;
  }

  if (systemState === 'terminal') {
    return (
      <div className='h-screen w-screen bg-black'>
        <div className='h-full w-full'>
          <DynamicTerminalClient
            onGameStart={handleGameStart}
            onReboot={handleReboot}
          />
        </div>
      </div>
    );
  }

  // ゲーム状態
  if (systemState === 'gaming' && opponentIdx !== null) {
    const commonProps = {
      opponent: Object.values(opponents)[opponentIdx],
      message,
      setMessage,
      isLoading,
      chatHistory,
      sendMessage,
      transitionToNextApp,
      handleBackToTerminal,
      remainingChats,
    };

    return (
      <main>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentApp}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            {currentApp === 'pokemon' && (
              <PokemonChat
                {...commonProps}
                handleBackToTerminal={handleBackToTerminal}
                transitionToNextApp={transitionToNextApp}
              />
            )}
            {currentApp === 'menheraTodo' && (
              <MenheraTodo {...commonProps} setChatHistory={setChatHistory} />
            )}
            {currentApp === 'wordCounter' && <WordCounter {...commonProps} />}
            {currentApp === 'sns' && <SocialFeed {...commonProps} />}
          </motion.div>
        </AnimatePresence>
      </main>
    );
  }

  // Loading状態
  return (
    <div className='h-screen w-screen bg-black text-green-400 font-mono flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-4'></div>
        <p>Initializing Aizu Rehack System...</p>
      </div>
    </div>
  );
}
