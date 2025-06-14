"use client";
import Image from "next/image";
import type { HeraMood } from "@/lib/menheraTodo/state";
import { useHera } from "@/lib/menheraTodo/context";

const moodToImage: Record<HeraMood, { src: string; alt: string }> = {
  最高: {
    src: "/hera-chan/main/excellent.png",
    alt: "最高のヘラちゃん",
  },
  良い: {
    src: "/hera-chan/main/good.png",
    alt: "良いヘラちゃん",
  },
  普通: {
    src: "/hera-chan/main/neutral.png",
    alt: "普通のヘラちゃん",
  },
  悪い: { src: "/hera-chan/main/bad.png", alt: "悪いヘラちゃん" },
  非常に悪い: {
    src: "/hera-chan/main/very-bad.png",
    alt: "とても悪いヘラちゃん",
  },
};

/**
 * 好感度からムードを判定し、対応するヘラちゃん画像を表示するコンポーネント
 */
export default function HeraMainImage() {
  const { mood } = useHera();
  const { src, alt } = moodToImage[mood];

  return (
    <div
      className={`
    fixed bottom-0 
    left-1/2 transform -translate-x-2/3

    w-[400px] h-[500px]
    sm:w-[420px] sm:h-[520px]
    md:w-[450px] md:h-[550px]
    lg:w-[550px] lg:h-[600px] lg:-bottom-24
    xl:w-[600px] xl:h-[650px] xl:-bottom-32
    2xl:w-[650px] 2xl:h-[700px]

    /* PC (>md) 以上では左マージン20％に */
    md:left-[25%] md:transform-none
  `}
    >
      <Image src={src} alt={alt} fill className="object-contain" />
    </div >
  );
}
