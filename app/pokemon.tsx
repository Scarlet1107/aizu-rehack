'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'player' | 'opponent';
}

export default function PokemonChat() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: 'What will RAICHU do?',
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
    <div className='w-full h-screen bg-[#f8f8f8] flex flex-col p-4 gap-4 relative'>
      {/* Top Section - Opponent Pokemon */}
      <div className='flex justify-between items-start h-48 relative z-10'>
        {/* Opponent Pokemon Info */}
        <div className='bg-white border-4 border-black rounded-lg p-2 min-w-[200px]'>
          <div className='flex items-center gap-2 mb-1'>
            <span className='font-bold text-lg'>SEEL</span>
            <span className='text-sm'>Lv36</span>
          </div>
          <div className='text-xs mb-1'>HP</div>
          <div className='w-32 h-2 bg-white border border-black'>
            <div className='h-full bg-green-500 w-3/4'></div>
          </div>
        </div>

        {/* Opponent Pokemon Sprite */}
        <div className='w-32 h-32 relative mt-8'>
          {/* Oval platform for opponent */}
          <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-12 bg-gradient-to-b from-green-300 to-green-500 rounded-[50%] opacity-60 shadow-lg'></div>

          <Image
            src='/greninja.svg'
            alt='Opponent Pokemon'
            fill
            className='object-contain drop-shadow-lg relative z-10'
          />
        </div>
      </div>

      {/* Middle Section - Player Pokemon */}
      <div className='flex mt-auto justify-between items-end h-32 relative z-10'>
        {/* Player Pokemon Sprite */}
        <div className='w-32 h-32 relative ml-12'>
          <Image
            src='/charizard.svg'
            alt='Player Pokemon'
            fill
            className='object-contain drop-shadow-lg'
          />
        </div>

        {/* Player Pokemon Info */}
        <div className='bg-white border-4 border-black rounded-lg p-2 min-w-[200px]'>
          <div className='flex items-center gap-2 mb-1'>
            <span className='font-bold text-lg'>RAICHU</span>
            <span className='text-sm'>Lv51</span>
          </div>
          <div className='text-xs mb-1'>HP</div>
          <div className='w-32 h-2 bg-white border border-black mb-1'>
            <div className='h-full bg-green-500 w-full'></div>
          </div>
          <div className='text-xs'>126/126</div>
          <div className='text-xs mt-1'>EXP</div>
          <div className='w-32 h-1 bg-white border border-black'>
            <div className='h-full bg-blue-500 w-2/3'></div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Battle Text/Chat Box */}
      <div className='mt-10 p-3 bg-white border-4 border-black rounded-lg overflow-hidden grid grid-cols-2 place-content-center relative z-10'>
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
            <Button onClick={handleFightClick}>CHAT</Button>
            <Button onClick={handleFightClick}>TALK</Button>
            <Button onClick={handleFightClick}>SPEAK</Button>
            <Button onClick={handleFightClick}>YELL</Button>
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
                placeholder='Type your message...'
                className='flex-1 p-2 border-2 border-black text-sm font-mono'
                autoFocus
              />
              <button
                onClick={handleSendMessage}
                className='px-3 py-2 bg-blue-500 text-white border-2 border-black text-xs font-bold hover:bg-blue-600'>
                SEND
              </button>
            </div>
            <button
              onClick={handleBackClick}
              className='w-full bg-gray-100 border-2 border-black p-2 text-sm font-bold hover:bg-gray-200'>
              BACK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

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
