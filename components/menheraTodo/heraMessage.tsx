'use client';

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { getHeraMood, getShakeIntensity, HeraMood } from "@/lib/menheraTodo/state";
import { useHera } from "@/lib/menheraTodo/context";
import { ChatMessage } from "@/app/page"; // 適宜パスを合わせてください

interface HeraMessageProps {
  chatHistory: ChatMessage[];
  delay?: number;
}

const moodColorMap: Record<HeraMood, string> = {
  最高: "bg-pink-50 dark:bg-pink-500",
  良い: "bg-pink-100 dark:bg-pink-700",
  普通: "bg-stone-100 dark:bg-stone-700",
  悪い: "bg-stone-200 dark:bg-stone-800",
  非常に悪い: "bg-red-700 dark:bg-red-800",
};

const moodShadowMap: Record<HeraMood, string> = {
  最高: "shadow-pink-100 dark:shadow-pink-800",
  良い: "shadow-pink-50  dark:shadow-pink-700",
  普通: "shadow-stone-100 dark:shadow-stone-700",
  悪い: "shadow-stone-200 dark:shadow-stone-900",
  非常に悪い: "shadow-black/20 dark:shadow-white/20",
};

const moodFontMap: Record<HeraMood, string> = {
  最高: "font-happy",
  良い: "font-happy",
  普通: "font-sans",
  悪い: "font-angry",
  非常に悪い: "font-creepy",
};

const HeraMessage: React.FC<HeraMessageProps> = ({ chatHistory, delay = 60 }) => {
  const { affection } = useHera();
  const controls = useAnimation();
  const shakeIntensity = getShakeIntensity(affection);
  const mood = getHeraMood(affection);
  const background = moodColorMap[mood];
  const shadow = moodShadowMap[mood];
  const font = moodFontMap[mood];

  // opponent の最新メッセージを取得
  const latestOpponent = chatHistory
    .filter((m) => m.sender === 'opponent')
    .slice(-1)[0]?.text ?? '';

  const [displayedText, setDisplayedText] = useState("");
  const textSize = latestOpponent.length > 50 ? "text-sm" : "text-base md:text-lg";
  const intensity = Math.max(0, Math.min(shakeIntensity, 10));
  const offset = intensity * 0.2;

  useEffect(() => {
    setDisplayedText("");
    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= latestOpponent.length) {
        clearInterval(interval);
        return;
      }
      const ch = latestOpponent[idx];
      setDisplayedText((prev) => prev + ch);
      if (shakeIntensity > 0) {
        controls.start({
          x: [0, -offset, offset, -offset / 2, offset / 2, 0],
          y: [0, offset / 1.5, -offset / 1.5, offset, -offset, 0],
          transition: { duration: 0.25, ease: "easeInOut" },
        });
      }
      idx++;
    }, delay);

    return () => clearInterval(interval);
  }, [latestOpponent, delay, controls, offset, shakeIntensity]);

  return (
    <div className={`z-50 p-4 relative rounded-xl whitespace-pre-wrap transition-all duration-300 ${background} ${shadow} ${font} ${textSize} shadow-md`}>
      <motion.span animate={controls} className="inline-block">
        {displayedText}
      </motion.span>
    </div>
  );
};

export default HeraMessage;
