'use client';
import React from 'react';
import HeraMessage from '@/components/menheraTodo/heraMessage';
import { AffectionBadge } from '@/components/menheraTodo/affectionBadge';
import HeraMainImage from '@/components/menheraTodo/heraMainImage';
import { HeraProvider, HeraStatus } from '@/lib/menheraTodo/context';
import DynamicBackground from '@/components/menheraTodo/DynamicBackground';
import Header from '@/components/menheraTodo/heraHeader';
import { Toaster } from 'sonner';
import { MobileNavigation } from '@/components/menheraTodo/mobileNavigation';
import { ChatProps } from './pokemon';
import ChatForm from '@/components/menheraTodo/ChatForm';

export const DEFAULT_HERA_MESSAGE = "わたしのこと好きじゃないの？嫌いになっちゃった？面倒くさいしもう会いたくないんでしょ";

interface MenheraTodoProps extends ChatProps {
  setChatHistory: React.Dispatch<React.SetStateAction<any>>;
}

const MenheraTodo = ({
  transitionToNextApp,
  chatHistory,
  message,
  setMessage,
  remainingChats,
  isLoading,
  setChatHistory,
  sendMessage,
}: MenheraTodoProps) => {
  const status: HeraStatus = {
    affection: 39,
    mood: '非常に悪い',
    event: 'very_long_gap',
    delta: 0,
    message: 'dammy_message',
  };

  return (
    <HeraProvider status={status}>
      <main className='min-h-screen flex flex-col items-center'>
        <div className='w-full h-14 shadow-sm flex items-center justify-end'>
          <Header chatHistory={chatHistory} setChatHistory={setChatHistory} />
        </div>
        <DynamicBackground />
        <div className='z-10 min-w-0 w-full pt-4 flex-1 flex flex-col'>
          {/* ヘラちゃんのメッセージ部分 */}
          <div className='mx-4 flex-1'>
            <HeraMessage chatHistory={chatHistory} />
          </div>
          {/* 好感度バッジ */}
          <div className='fixed right-4 bottom-40 md:bottom-56 md:right-20'>
            <AffectionBadge />
          </div>
          {/* メインイメージ */}
          <HeraMainImage />

          <ChatForm message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
      </main>

      <MobileNavigation isHard={false} chatHistory={chatHistory} setChatHistory={setChatHistory} />
      <Toaster />
    </HeraProvider>
  );
};

export default MenheraTodo;
