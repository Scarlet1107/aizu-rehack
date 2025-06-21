This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Aizu Rehack App について

このリポジトリは、チーム「bless you」によって開発された多機能Webアプリケーション「Aizu Rehack App」のソースコードです。Next.js (App Router), TypeScript, Tailwind CSS を主な技術スタックとして採用し、ユーザーにユニークでインタラクティブな体験を提供することを目指しています。

### 主要機能

本アプリケーションは、以下の主要機能を提供します。

*   **メンヘラTODO**: タスク管理機能に、ユーザーのアクションやタスクの進捗に応じて感情や見た目が変化するキャラクター（hera-chan）を組み合わせた、モチベーション維持を支援するTODOアプリケーションです。
*   **ポケモン**: ポケモンに関連するインタラクティブなコンテンツです。
*   **SNS**: 他のユーザーと交流できるシンプルなSNS機能です。
*   **ワードカウンター**: 入力されたテキストの文字数をリアルタイムでカウントするユーティリティツールです。
*   **Webターミナル**: ブラウザ上で動作するターミナルエミュレータです。WebAssemblyを利用して、特定のコマンド実行やインタラクティブな操作が可能です。

### 技術スタック

*   **フレームワーク**: [Next.js](https://nextjs.org/) (v15.x, App Router)
*   **プログラミング言語**: [TypeScript](https://www.typescriptlang.org/)
*   **UIライブラリ・フレームワーク**:
    *   [React](https://react.dev/) (v19)
    *   [Tailwind CSS](https://tailwindcss.com/) (v4)
    *   UIコンポーネント: [shadcn/ui](https://ui.shadcn.com/) (Radix UIベース)
    *   アイコン: [Lucide React](https://lucide.dev/)
    *   アニメーション: [Framer Motion](https://www.framer.com/motion/)
*   **API連携**:
    *   [Google Generative AI SDK](https://ai.google.dev/): チャット機能などで利用
*   **その他**:
    *   [Xterm.js](https://xtermjs.org/): Webターミナル機能
    *   WebAssembly: ターミナル機能の一部ロジックで使用

### ディレクトリ構造の概要

*   `app/`: Next.jsのApp Routerに基づいたルーティング、各ページのコンポーネント、APIルート
*   `components/`: UIコンポーネント (共通コンポーネント、各機能ごとのコンポーネント)
*   `lib/`: ユーティリティ関数、カスタムフック、型定義、状態管理ロジック
*   `public/`: 静的アセット (画像、フォントなど)
*   `wasm/`: WebAssemblyのソースコード (C言語) およびビルド関連ファイル

### PWA対応

このアプリケーションは、PWA (Progressive Web App) としての基本的な機能を備えており、対応ブラウザではホーム画面へのインストールやオフラインでの一部利用が可能です。

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
