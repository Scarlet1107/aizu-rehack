'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'player' | 'opponent';
}

export default function PokemonChat() {
  return (
    <div className='h-screen w-screen py-6 bg-neutral-700'>
      <Screen />
    </div>
  );
}

function Screen() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: 'どうする？',
      sender: 'opponent',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [showChatInput, setShowChatInput] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      text: inputText,
      sender: 'player',
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // Simulate opponent response
    setTimeout(() => {
      const opponentResponse: ChatMessage = {
        id: chatMessages.length + 2,
        text: getOpponentResponse(),
        sender: 'opponent',
      };
      setChatMessages((prev) => [...prev, opponentResponse]);
    }, 1000);
  };

  const getOpponentResponse = () => {
    const responses = [
      'What will RAICHU do?',
      'SEEL used Water Gun!',
      "It's super effective!",
      'RAICHU is confused!',
      "SEEL's attack missed!",
      "What's your next move?",
      'The wild SEEL appeared!',
      'RAICHU used Thunder!',
      'Critical hit!',
      'SEEL fainted!',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleFightClick = () => {
    setShowChatInput(true);
  };

  const handleBackClick = () => {
    setShowChatInput(false);
  };

  return (
    <div className='h-full mx-auto bg-white flex flex-col p-8 relative aspect-[10/9]'>
      {/* Top Section - Opponent Pokemon */}
      <div className='flex justify-between items-start h-48 relative z-10'>
        {/* Opponent Pokemon Info */}
        <PokemonInfo name='SEEL' level={69} hp={90} maxHp={100} />
        {/* Opponent Pokemon Sprite */}
        <PokemonSprite src='/greninja.svg' />
      </div>

      {/* Middle Section - Player Pokemon */}
      <div className='flex mt-auto justify-between items-end h-32 relative z-10'>
        {/* Player Sprite */}
        <Image
          src='/person.png'
          alt='Player'
          width={256}
          height={256}
          className='object-contain'
        />
        {/* Player Pokemon Info */}
        <PokemonInfo
          name='RAICHU'
          className='mb-12'
          level={42}
          hp={39}
          maxHp={100}
        />
      </div>

      {/* Bottom Section - Battle Text/Chat Box */}
      <div className='p-3 bg-white border-4 border-black rounded-lg overflow-hidden grid grid-cols-2 place-content-center relative z-10'>
        {/* Chat Messages */}
        <div className='flex-1 overflow-y-auto p-4 bg-white h-36'>
          <div className='space-y-2 overflow-y-scroll'>
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'player' ? 'justify-end' : 'justify-start'
                }`}>
                <div
                  className={`max-w-[80%] p-2 rounded ${
                    message.sender === 'player'
                      ? 'bg-blue-100 text-right'
                      : 'bg-gray-100'
                  }`}>
                  <span className='font-mono text-sm'>{message.text}</span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Menu/Input Section */}
        {!showChatInput ? (
          /* Menu Buttons */
          <div className='grid grid-cols-2 gap-1 text-center h-full'>
            <Button onClick={handleFightClick}>はなす</Button>
            <Button onClick={handleFightClick}>しゃべる</Button>
            <Button onClick={handleFightClick}>さけぶ</Button>
            <Button onClick={handleFightClick}>にげる</Button>
          </div>
        ) : (
          /* Chat Input */
          <div className='grid p-2 h-full'>
            <div className='flex gap-2 mb-2'>
              <input
                type='text'
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder='なにをはなす？'
                className='flex-1 p-2 border-2 border-black text-sm font-mono'
                autoFocus
              />
              <button
                onClick={handleSendMessage}
                className='px-3 py-2 bg-blue-500 text-white border-2 border-black text-xs font-bold hover:bg-blue-600'>
                おくる
              </button>
            </div>
            <button
              onClick={handleBackClick}
              className='w-full bg-gray-100 border-2 border-black p-2 text-sm font-bold hover:bg-gray-200'>
              もどる
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const PokemonSprite = ({ src }: { src: string }) => {
  return (
    <div className='w-50 h-50 relative'>
      <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-12 bg-gradient-to-b from-green-300 to-green-500 rounded-[50%] opacity-60 shadow-lg'></div>
      <Image src={src} alt='Pokemon' fill className='object-contain' />
    </div>
  );
};

const PokemonInfo = ({
  name,
  className,
  level,
  hp,
  maxHp,
}: {
  name: string;
  className?: string;
  level: number;
  hp: number;
  maxHp: number;
}) => {
  const hpPercentage = (hp / maxHp) * 100;
  return (
    <div
      className={`bg-white border-4 border-black rounded-lg p-2 min-w-[200px] ${className}`}>
      <div className='flex items-center gap-2 mb-1'>
        <span className='font-bold text-lg'>{name}</span>
        <span className='text-sm'>Lv{level}</span>
      </div>
      <div className='text-xs mb-1'>HP</div>
      <div className='w-32 h-2 bg-white border border-black'>
        <div
          className='h-full bg-green-500'
          style={{ width: `${hpPercentage}%` }}></div>
      </div>
    </div>
  );
};

const Button = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className='bg-gray-100 border-2 border-black p-2 text-sm font-bold hover:bg-gray-200'>
      {children}
    </button>
  );
};
