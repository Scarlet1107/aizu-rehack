## May `rand()` GUIDE You について

アート性と技術の融合を目指し、従来のWebアプリケーションの枠にとらわれない、驚きと発見に満ちた体験を提供します。
画面の要素、表示されるコンテンツ、さらにはチャットの会話相手まで、あらゆるものがランダム性を帯びてダイナミックに変化し、アクセスするたびに新しい表情を見せるアプリケーションです。

Next.js (App Router), TypeScript, Tailwind CSS を主な技術スタックとして採用し、WebAssembly (C言語をEmscriptenでコンパイル) などの先進技術も積極的に取り入れています。

### デプロイ先URL

本アプリケーションは、以下のURLで公開されています。ぜひ、「変幻自在」な世界を体験してください。

[https://bless-you.scarlet7.net](https://bless-you.scarlet7.net)

### 主要機能

本アプリケーションは、以下の主要機能を提供します。それぞれの機能もまた、「変幻自在」のテーマのもと、ランダムな要素や予期せぬ変化をお楽しみいただけます。

*   **メンヘラTODO**: ただのタスク管理ではありません。あなたの行動やタスクの進捗、そして時には気まぐれによって、キャラクター（hera-chan）の感情やビジュアルが様々に変化します。
*   **ポケモン**: おなじみのポケモンたちが、予期せぬ形であなたを待ち受けます。ランダムに表示されるポケモンとの出会いをお楽しみください。
*   **チャット風アプリ (SNS)**: 会話相手がランダムに切り替わる、刺激的なチャット体験。ゲッコウガ、ヘラちゃん、謎のアラビア語スピーカー、サイボーグ猫など、個性豊かなキャラクターたちとの予測不可能な会話が展開されます。
*   **ワードカウンター**: シンプルながらも、キャラクターがランダムに変化する、遊び心のある文字数カウンターです。
*   **Webターミナル**: ブラウザ上で動作するターミナルエミュレータ。`gamestart`コマンドでアプリケーションのデモを開始したり、隠された機能を発見したりできます。WebAssembly (C言語で実装) を活用し、`memory`コマンドでWASMの線形メモリの状況（スタックポインタ、ヒープ、関数アドレスなど）を模倣表示するなど、ユニークなインタラクションを実現しています。

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
    *   [Google Generative AI SDK](https://ai.google.dev/): チャット機能の会話生成などで利用
*   **WebAssembly (WASM)**:
    *   **概要**: C言語で記述されたロジック (`wasm/src/fake_shell.c`) をブラウザ上でネイティブに近いパフォーマンスで実行可能にする技術です。
    *   **Emscripten**: LLVMコンパイラツールチェーンを使用し、C言語ソースコードをWebAssemblyバイナリに変換します。また、C言語関数をJavaScriptから通常の関数のように呼び出せるよう、自動的にバインディング（ラッパーファイル `public/fake_shell.js`）を生成します。
    *   **ビルドプロセス**: `emcc` コマンド (例: `emcc -O2 -s WASM=1 -s MODULARIZE=1 -s ENVIRONMENT='web' -s EXPORTED_FUNCTIONS='["_process_command", "_free_string", "_main"]' -s EXPORTED_RUNTIME_METHODS='["cwrap"]' -s ALLOW_MEMORY_GROWTH=1 --no-entry wasm/src/fake_shell.c -o public/fake_shell.js`) を使用して、Cコードを最適化し、ES6モジュール形式でWASMファイルと連携用JavaScriptファイルを出力します。これによりNext.jsプロジェクトとの統合が容易になります。
    *   **Next.jsでの利用**: `dynamic import` を使用してWASMモジュールをクライアントサイドでのみ読み込みます。
    *   **メモリ管理**: WASMは線形メモリモデルを採用しており、ブラウザのメモリ内に連続した仮想アドレス空間（最大4GBまで成長可能）を確保します。C言語のポインタ操作や`malloc`によるメモリ確保も、このブラウザプロセス内のヒープ領域で行われ、OSのローカルメモリにはアクセスしません。
*   **その他**:
    *   [Xterm.js](https://xtermjs.org/): Webターミナル機能のUI部分

### ディレクトリ構造の概要

*   `app/`: Next.jsのApp Routerに基づいたルーティング、各ページのコンポーネント、APIルート
*   `components/`: UIコンポーネント (共通コンポーネント、各機能ごとのコンポーネント)
*   `lib/`: ユーティリティ関数、カスタムフック、型定義、状態管理ロジック
*   `public/`: 静的アセット (画像、フォント、WASM関連ファイル (`fake_shell.js`, `fake_shell.wasm`) など)
*   `wasm/src/`: WebAssemblyのC言語ソースコード (`fake_shell.c`)

## はじめに

### アプリケーションの開始方法

1.  まず、依存関係をインストールします（初回のみ）。
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```
2.  次に、開発サーバーを起動します:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```
3.  ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。
4.  アプリケーション内のターミナルが表示されたら、以下のコマンドを入力して「変幻自在」な体験を開始してください。
    ```
    GAMESTART
    ```
    May rand() GUIDE you!

