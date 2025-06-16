'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

// wasmの型定義
interface FakeShellModuleInstance {
  cwrap: (ident: string, returnType: string | null, argTypes: (string | null)[]) => (...args: any[]) => any;
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
  getValue: (ptr: number, type: string) => any;
  setValue: (ptr: number, value: any, type: string) => void;
  UTF8ToString: (ptr: number) => string;
  stringToUTF8: (str: string, outPtr: number, maxBytesToWrite: number) => void;
  lengthBytesUTF8: (str: string) => number;
}
type FakeShellModuleFactory = () => Promise<FakeShellModuleInstance>;

// 行列乗算（JavaScript版）
const matrixMultiplyJS = (size: number): number => {
  // 行列A, B, Cを作成
  const A = Array(size).fill(0).map(() => Array(size).fill(0));
  const B = Array(size).fill(0).map(() => Array(size).fill(0));
  const C = Array(size).fill(0).map(() => Array(size).fill(0));

  // 行列を初期化
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      A[i][j] = i + j + 1;
      B[i][j] = i * j + 1;
    }
  }

  // 行列の乗算 C = A * B
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      for (let k = 0; k < size; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }

  // 結果の合計を計算
  let sum = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      sum += C[i][j];
    }
  }

  return sum;
};

// JavaScriptでのコマンド処理（WASM以外の処理）
const processJavaScriptCommand = (command: string): string | null => {
  const trimmedCommand = command.trim();

  // 行列乗算（JavaScript版）
  if (trimmedCommand.startsWith('matrixJs ')) {
    const sizeStr = trimmedCommand.substring(9);
    const size = parseInt(sizeStr);

    if (isNaN(size) || size < 2 || size > 500) {
      return 'matrixJs: Please specify a matrix size between 2 and 500';
    }

    console.log(`🧮 Computing ${size}x${size} matrix multiplication in JavaScript with timing`);

    // JavaScript側での時間測定
    const startTime = performance.now();
    const sum = matrixMultiplyJS(size);
    const endTime = performance.now();

    const executionTime = endTime - startTime;
    const memoryMB = (size * size * 3 * 8) / (1024 * 1024); // 8 bytes per number

    const output =
      `🧮 matrixJs(${size}x${size}) = ${sum.toFixed(2)} (checksum)\n` +
      `⏱️  Execution time: ${executionTime.toFixed(3)} ms (JavaScript)\n` +
      `💾 Memory intensive: ${size} x ${size} x 3 matrices (${memoryMB.toFixed(1)} MB)`;

    console.log(`Matrix multiplication completed in JavaScript: ${sum.toFixed(2)} (${executionTime.toFixed(3)} ms)`);
    return output;
  }

  // その他のJavaScript専用コマンドがあればここに追加

  return null; // JavaScript側で処理しない場合
};

const TerminalClient = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<Terminal | null>(null);
  const fitAddonInstance = useRef<FitAddon | null>(null);
  const [isTerminalInitialized, setIsTerminalInitialized] = useState(false);

  const wasmReadyRef = useRef(false);
  const processCommandFuncRef = useRef<((cmd: string) => string) | null>(null);
  const freeStringFuncRef = useRef<((ptr: number) => void) | null>(null);
  const moduleInstanceRef = useRef<FakeShellModuleInstance | null>(null);

  const [_, setWasmReadyForEffect] = useState(false);

  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);
  const currentInput = useRef<string>('');

  useEffect(() => {
    if (terminalRef.current && !termInstance.current && typeof window !== 'undefined') {
      console.log('Initializing Xterm.js');
      const xterm = new Terminal({
        cursorBlink: true,
        convertEol: true,
        fontSize: 14,
        fontFamily: 'monospace',
      });
      const addon = new FitAddon();

      termInstance.current = xterm;
      fitAddonInstance.current = addon;

      xterm.loadAddon(addon);
      xterm.open(terminalRef.current);
      addon.fit();

      xterm.writeln('Welcome to Fake Shell!');
      xterm.writeln('Loading WASM module (Modularized)...');
      setIsTerminalInitialized(true);

      xterm.onData((data: string) => {
        const term = termInstance.current;
        if (!term) return;
        const code = data.charCodeAt(0);

        if (code === 13) {
          const trimmedInput = currentInput.current.trim();
          term.writeln('');

          if (trimmedInput) {
            if (trimmedInput !== commandHistory.current[commandHistory.current.length - 1]) {
              commandHistory.current.push(trimmedInput);
            }
            historyIndex.current = commandHistory.current.length;

            // まずJavaScript側で処理を試行
            const jsResult = processJavaScriptCommand(trimmedInput);
            if (jsResult !== null) {
              // JavaScript側で処理された場合
              if (trimmedInput === 'clear') {
                term.clear();
              } else {
                term.writeln(jsResult.replace(/\n/g, '\r\n'));
              }
            } else if (wasmReadyRef.current && typeof processCommandFuncRef.current === 'function') {
              // WASM側で処理
              try {
                console.log(`Executing command in WASM: "${trimmedInput}"`);
                const result = processCommandFuncRef.current(trimmedInput);
                console.log(`WASM Result: "${result}"`);

                // clearコマンドの場合は画面をクリア
                if (trimmedInput === 'clear') {
                  term.clear();
                } else {
                  term.writeln(result.replace(/\n/g, '\r\n'));
                }
              } catch (e: any) {
                console.error('Error executing command:', e);
                term.writeln(`Error: ${e.message || e}\r\n`);
              }
            } else {
              console.warn(
                `WASM not ready or processCommandFunc is not a function. wasmReadyRef.current: ${wasmReadyRef.current}, typeof processCommandFuncRef.current: ${typeof processCommandFuncRef.current}`
              );
              term.writeln('WASM not ready. Please wait.\r\n');
            }
          }
          currentInput.current = '';
          term.write('$ ');
        } else if (code === 127 || code === 8) {
          if (currentInput.current.length > 0) {
            term.write('\b \b');
            currentInput.current = currentInput.current.slice(0, -1);
          }
        } else if (code === 27) {
          if (data === '\x1b[A') {
            if (historyIndex.current > 0) {
              historyIndex.current--;
              const cmd = commandHistory.current[historyIndex.current];
              term.write('\r$ ' + ' '.repeat(currentInput.current.length) + '\r$ ' + cmd);
              currentInput.current = cmd;
            }
          } else if (data === '\x1b[B') {
            if (historyIndex.current < commandHistory.current.length - 1) {
              historyIndex.current++;
              const cmd = commandHistory.current[historyIndex.current];
              term.write('\r$ ' + ' '.repeat(currentInput.current.length) + '\r$ ' + cmd);
              currentInput.current = cmd;
            } else if (historyIndex.current === commandHistory.current.length - 1) {
              historyIndex.current++;
              term.write('\r$ ' + ' '.repeat(currentInput.current.length));
              currentInput.current = '';
            }
          }
        } else if (code >= 32 && code <= 126) {
          currentInput.current += data;
          term.write(data);
        }
      });
    }

    const handleResize = () => {
      fitAddonInstance.current?.fit();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    if (wasmReadyRef.current && isTerminalInitialized && termInstance.current) {
      console.log('WASM is ready, showing prompt.');
      termInstance.current.writeln('Fake Shell is ready. Type your command.');
      termInstance.current.writeln('🚀 Try: matrixC 100 (WASM C) vs matrixJs 100 (JavaScript)');
      termInstance.current.write('$ ');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTerminalInitialized, _]);

  const handleScriptLoad = () => {
    console.log('fake_shell.js loaded via next/script (Modularized)');
    // 直接Moduleにアクセスして実行
    if (typeof (window as any).Module === 'function') {
      console.log('Module factory function found.');
      ((window as any).Module as FakeShellModuleFactory)()
        .then((moduleInstance: FakeShellModuleInstance) => {
          console.log('Emscripten Module Instance Initialized (Modularized).');
          moduleInstanceRef.current = moduleInstance;

          try {
            // process_command関数をラップ
            const cwrappedFunc = moduleInstance.cwrap(
              'process_command',
              'string',
              ['string']
            );

            // free_string関数もラップ
            const freeStringFunc = moduleInstance.cwrap(
              'free_string',
              null,
              ['number']
            );

            // JavaScript側で使いやすいようにラップした関数を作成
            const wrappedProcessCommand = (cmd: string): string => {
              try {
                const result = cwrappedFunc(cmd);
                return result || '';
              } catch (error) {
                console.error('Error in WASM function call:', error);
                return `Error: ${error}`;
              }
            };

            processCommandFuncRef.current = wrappedProcessCommand;
            freeStringFuncRef.current = freeStringFunc;

            console.log(`cwrap for process_command completed. typeof result: ${typeof cwrappedFunc}`);
            if (typeof cwrappedFunc === 'function') {
              console.log('cwrap successful: process_command is a function.');
              wasmReadyRef.current = true;
              setWasmReadyForEffect(true);
            } else {
              console.error('cwrap failed: process_command is NOT a function after cwrap. Value:', cwrappedFunc);
              termInstance.current?.writeln('Error: Failed to properly wrap WASM function process_command.');
            }
          } catch (e: any) {
            console.error('Error during cwrap call for process_command:', e);
            termInstance.current?.writeln(`Error initializing WASM functions: ${e.message || e}`);
          }
        })
        .catch(err => {
          console.error('Error initializing FakeShellModule instance:', err);
          termInstance.current?.writeln('Critical Error: Failed to initialize WASM module instance.');
        });
    } else {
      console.error('Module factory function not found after fake_shell.js loaded.');
      console.log('Available window properties:', Object.keys(window).filter(key => key.includes('Module') || key.includes('module')));
      termInstance.current?.writeln('Error: WASM Module factory not found.');
    }
  };

  const handleScriptError = (e: any) => {
    console.error('Failed to load fake_shell.js:', e);
    termInstance.current?.writeln('Error: Failed to load WASM helper script.');
  };

  // // wasmスクリプトの動的読み込み
  useEffect(() => {
    if (isTerminalInitialized && !wasmReadyRef.current) {
      const script = document.createElement('script');
      script.src = '/fake_shell.js';
      script.onload = handleScriptLoad;
      script.onerror = handleScriptError;
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [isTerminalInitialized]);

  return (
    <>
      <div ref={terminalRef} style={{ flex: 1, width: '100%', height: '100%', backgroundColor: '#1e1e1e' }} />
    </>
  );
};

export default TerminalClient; 