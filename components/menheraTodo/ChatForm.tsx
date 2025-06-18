import React, { useState } from 'react'
// Shadcn UI components
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Mail } from 'lucide-react';
import { useHera } from '@/lib/menheraTodo/context';

interface ChatProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
  isLoading: boolean;
}

const ChatForm: React.FC<ChatProps> = ({ message, setMessage, sendMessage, isLoading }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* PC: 入力エリア */}
      <form
        className='hidden md:flex justify-center w-full py-4'
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>ヘラちゃんに何を送る？</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder='メッセージを入力'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
          </CardContent>
          <CardFooter>
            <Button
              type='submit'
              className='bg-pink-600 hover:bg-pink-700 text-white'
              disabled={isLoading || message.trim() === ''}
            >
              {isLoading ? '送信中...' : '送信'}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Mobile: ダイアログ入力 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className='fixed right-4 bottom-20 md:bottom-28 md:right-20 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-lg transition-all duration-200 ease-in-out'
            disabled={isLoading}
          >
            <Mail className='w-8 h-8 text-pink-50 font-bold' />
          </button>
        </DialogTrigger>
        <DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
              setOpen(false);
            }}
          >
            <DialogHeader>
              <DialogTitle className='mb-4'>ヘラちゃんにメッセージを送る</DialogTitle>
            </DialogHeader>
            <Input
              placeholder='メッセージを入力'
              className='w-full mb-4'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
            <DialogFooter>
              <Button
                type='submit'
                className='w-full bg-pink-600 hover:bg-pink-700 text-white'
                disabled={isLoading || message.trim() === ''}
              >
                {isLoading ? '送信中...' : '送信'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ChatForm;
