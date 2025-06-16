import Head from "next/head";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "すごい文字数カウント",
              description:
                "リアルタイム文字数カウントとAIアドバイスで文章を改善する便利なアプリ。",
              url: "https://scarlet7.net/word-counter",
              image: "/icon.png",
            }),
          }}
        />
      </Head>
      <header className="w-screen text-center  bg-gray-800 text-white flex pl-16 items-center">
        <Image
          src={"/word-counter/header.png"}
          height={100}
          width={300}
          alt="すごい文字数カウント"
          loading="eager"
          className="py-2"
        />
      </header>
    </>
  );
};

export default Header;
