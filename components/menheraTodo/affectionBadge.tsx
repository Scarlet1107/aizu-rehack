"use client";
import { useHera } from "@/lib/menheraTodo/context";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getHeraMood } from "@/lib/menheraTodo/state";

interface Props {
  remainingChats: number;
}

export function AffectionBadge({ remainingChats }: Props) {
  const { affection, delta, setHeraStatus } = useHera();
  const initial = affection - delta;
  const [display, setDisplay] = useState(initial);
  const interval = 150; // アニメーションの間隔 150ms

  useEffect(() => {
    if (delta === 0) return;
    let cur = initial;
    const step = delta > 0 ? 1 : -1;
    const timer = setInterval(() => {
      cur += step;
      setDisplay(cur);
      if (cur === affection) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [affection, delta]);

  useEffect(() => {
    const affectionMap = [87, 72, 58, 37, 15];
    const newAffection = affectionMap[5 - remainingChats] ?? 15;
    const newMood = getHeraMood(newAffection)
    setHeraStatus({ affection: newAffection, delta: newAffection - affection, mood: newMood });
  }, [remainingChats]);

  return (
    <HoverCard openDelay={-0.1} closeDelay={-0.1}>
      <HoverCardTrigger>
        <div className="inline-flex items-center justify-center z-50 w-16 h-16 md:w-20 md:h-20 bg-pink-300 dark:bg-pink-400 dark:border-pink-500 rounded-full p-4">
          <motion.div
            key={display}
            initial={{ scale: 0.5, opacity: 0.2 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="text-pink-50 font-bold text-2xl md:text-3xl tabular-nums">
              {display}
            </span>
          </motion.div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        ヘラちゃんからの好感度です。0になるとあまりよくないことが起こります。
      </HoverCardContent>
    </HoverCard>
  );
}
