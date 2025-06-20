#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <time.h>
#include <math.h>
#include <emscripten/emscripten.h>

// 証明用ログQED
#define LOG_INFO(fmt, ...) printf("[WASM-INFO] " fmt "\n", ##__VA_ARGS__)
#define LOG_DEBUG(fmt, ...) printf("[WASM-DEBUG] " fmt "\n", ##__VA_ARGS__)

static int command_counter = 0;
static char last_command[256] = {0};

// 行列乗算 - メモリ集約的でWASMが有利
static double matrix_multiply_sum(int size) {
    LOG_DEBUG("Computing %dx%d matrix multiplication", size, size);
    
    // 行列A, B, Cを動的確保
    double** A = malloc(size * sizeof(double*));
    double** B = malloc(size * sizeof(double*));
    double** C = malloc(size * sizeof(double*));
    
    for (int i = 0; i < size; i++) {
        A[i] = malloc(size * sizeof(double));
        B[i] = malloc(size * sizeof(double));
        C[i] = malloc(size * sizeof(double));
    }
    
    // 行列を初期化（適当な値）
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            A[i][j] = (double)(i + j + 1);
            B[i][j] = (double)(i * j + 1);
            C[i][j] = 0.0;
        }
    }
    
    // 行列の乗算 C = A * B
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            for (int k = 0; k < size; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    
    // 結果の合計を計算（検証用）
    double sum = 0.0;
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            sum += C[i][j];
        }
    }
    
    // メモリ解放
    for (int i = 0; i < size; i++) {
        free(A[i]); free(B[i]); free(C[i]);
    }
    free(A); free(B); free(C);
    
    return sum;
}

EMSCRIPTEN_KEEPALIVE
char* process_command(char* command_str) {
    // コマンド実行開始をログ出力
    LOG_INFO("=== WASM C function called ===");
    LOG_INFO("Command received: '%s'", command_str ? command_str : "(null)");
    
    if (!command_str) {
        LOG_INFO("Null command detected in C code");
        return strdup("Error: null command");
    }
    
    command_counter++;
    strncpy(last_command, command_str, sizeof(last_command) - 1);
    last_command[sizeof(last_command) - 1] = '\0';
    
    LOG_INFO("Command #%d processed in C", command_counter);
    
    // === 基本コマンド ===
    if (strncmp(command_str, "echo ", 5) == 0) {
        char* message = command_str + 5;
        LOG_DEBUG("Echo command processed in C: '%s'", message);
        return strdup(message);
    } 
    
    // === WASM QEDコマンド ===
    else if (strcmp(command_str, "wasm-test") == 0) {
        LOG_INFO("WASM test command executed in C code");
        char* result = malloc(512);
        snprintf(result, 512, 
            "🔥 PROOF: This is executed in WASM C code! 🔥\n"
            "Command counter: %d\n"
            "Last command: %s\n"
            "Pointer address of this function: %p\n"
            "Memory allocated at: %p",
            command_counter, last_command, (void*)process_command, (void*)result);
        return result;
    }
    
    // === 行列乗算コマンド(wasm性能測定)===
    else if (strncmp(command_str, "matrixC ", 8) == 0) {
        int size = atoi(command_str + 8);
        if (size < 2 || size > 500) {
            return strdup("matrixC: Please specify a matrix size between 2 and 500");
        }
        
        LOG_INFO("🧮 Computing %dx%d matrix multiplication in WASM C", size, size);
        
        // C言語での時間測定開始
        clock_t start_time = clock();
        double sum = matrix_multiply_sum(size);
        clock_t end_time = clock();
        
        double execution_time = ((double)(end_time - start_time)) / CLOCKS_PER_SEC * 1000.0;
        
        char* output = malloc(512);
        snprintf(output, 512, 
            "🧮 matrixC(%dx%d) = %.2f (checksum)\n"
            "⏱️  Execution time: %.3f ms (WASM C)\n"
            "💾 Memory intensive: %d x %d x 3 matrices (%.1f MB)",
            size, size, sum, execution_time, size, size, 
            (double)(size * size * 3 * sizeof(double)) / (1024.0 * 1024.0));
        
        LOG_INFO("Matrix multiplication completed in C: %.2f (%.3f ms)", sum, execution_time);
        return output;
    }

    // === メモリ情報コマンド ===
    else if (strcmp(command_str, "memory") == 0) {
        LOG_INFO("Providing memory information from C");
        char* result = malloc(256);
        snprintf(result, 256,
            "💾 WASM Memory Info (from C):\n"
            "Stack pointer: %p\n"
            "Heap allocation: %p\n"
            "Function address: %p\n"
            "Commands processed: %d",
            &result, malloc(1), (void*)process_command, command_counter);
        return result;
    }
    
    // === ゲーム開始コマンド ===
    else if (strcmp(command_str, "gamestart") == 0) {
        LOG_INFO("Game start command executed in C code");
        
        // メモリ状態チェック
        void* test_alloc = malloc(1024 * 1024); // 1MB テストアロケーション
        int memory_check = (test_alloc != NULL);
        if (test_alloc) {
            free(test_alloc);
        }
        
        // システム状態チェック
        int system_ready = 1;
        
        // コマンド実行履歴チェック
        int commands_processed = command_counter;
        
        // ランダムシード設定（ゲーム用）
        srand((unsigned int)time(NULL));
        int game_seed = rand() % 10000;
        
        // 仮想的なリソースチェック
        double cpu_usage = 25.0 + (rand() % 50); // 25-75%の間でランダム
        double memory_usage = 45.0 + (rand() % 30); // 45-75%の間でランダム
        
        char* result = malloc(1024);
        if (!result) {
            return strdup("Error: Memory allocation failed for game initialization");
        }
        
        if (memory_check && system_ready && commands_processed >= 0) {
            // ゲーム開始OK
            snprintf(result, 1024,
                "🎮 Aizu Rehack Game System v1.0\n"
                "===============================\n"
                "🔍 System Diagnostics:\n"
                "   ✅ Memory Test: PASSED (1MB allocation successful)\n"
                "   ✅ System Status: READY\n"
                "   ✅ Commands Processed: %d\n"
                "   🎲 Game Seed: #%d\n"
                "   📊 CPU Usage: %.1f%%\n"
                "   💾 Memory Usage: %.1f%%\n"
                "\n"
                "⚡ Initializing game environment...\n"
                "🚀 Loading AI opponents...\n"
                "🎯 Preparing battle systems...\n"
                "\n"
                "✨ All systems green! GAME_START_OK\n"
                "🎮 Transitioning to game mode...\n",
                commands_processed, game_seed, cpu_usage, memory_usage);
        } else {
            // ゲーム開始NG
            snprintf(result, 1024,
                "❌ Aizu Rehack Game System - Startup Failed\n"
                "==========================================\n"
                "🔍 System Diagnostics:\n"
                "   %s Memory Test: %s\n"
                "   %s System Status: %s\n"
                "   📊 Commands Processed: %d\n"
                "\n"
                "⚠️  System not ready for game initialization.\n"
                "💡 Try running some commands first to warm up the system.\n"
                "🔧 Suggested: help, wasm-test, matrixC 50\n",
                memory_check ? "✅" : "❌",
                memory_check ? "PASSED" : "FAILED", 
                system_ready ? "✅" : "❌",
                system_ready ? "READY" : "NOT READY",
                commands_processed);
        }
        
        return result;
    }
    
    // === システム再起動コマンド ===
    else if (strcmp(command_str, "reboot") == 0) {
        LOG_INFO("Reboot command executed in C code");
        
        // システム状態確認
        int system_uptime = command_counter; // コマンド実行数を稼働時間とする
        
        // メモリ状態確認
        void* test_alloc = malloc(512 * 1024); // 512KB テストアロケーション
        int memory_status = (test_alloc != NULL);
        if (test_alloc) {
            free(test_alloc);
        }
        
        // プロセス状態シミュレーション
        int active_processes = 15 + (rand() % 20); // 15-35個のプロセス
        int zombie_processes = rand() % 3; // 0-2個のゾンビプロセス
        
        // ネットワーク接続状態
        int network_connections = 5 + (rand() % 15); // 5-20個の接続
        
        // ディスク使用率
        double disk_usage = 30.0 + (rand() % 40); // 30-70%の使用率
        
        char* result = malloc(1024);
        if (!result) {
            return strdup("Error: Memory allocation failed for reboot process");
        }
        
        if (memory_status && system_uptime >= 0) {
            // 再起動実行
            snprintf(result, 1024,
                "🔄 Aizu Rehack System Reboot Initiated\n"
                "=====================================\n"
                "🔍 Pre-reboot System Check:\n"
                "   ✅ Memory Status: HEALTHY (%dKB test allocation)\n"
                "   📊 System Uptime: %d commands processed\n"
                "   🏃 Active Processes: %d\n"
                "   💀 Zombie Processes: %d\n"
                "   🌐 Network Connections: %d\n"
                "   💾 Disk Usage: %.1f%%\n"
                "\n"
                "⚠️  Preparing for system shutdown...\n"
                "🔌 Terminating user sessions...\n"
                "💾 Syncing filesystems...\n"
                "🔄 Unmounting drives...\n"
                "⚡ Stopping services...\n"
                "\n"
                "✨ System ready for reboot! REBOOT_SYSTEM_NOW\n"
                "🚀 Rebooting Aizu Rehack OS...\n",
                512, system_uptime, active_processes, zombie_processes, 
                network_connections, disk_usage);
        } else {
            // 再起動エラー
            snprintf(result, 1024,
                "❌ Aizu Rehack System Reboot Failed\n"
                "===================================\n"
                "🔍 Pre-reboot System Check:\n"
                "   %s Memory Status: %s\n"
                "   📊 System Uptime: %d commands\n"
                "\n"
                "⚠️  System not ready for safe reboot.\n"
                "💡 Try running some commands to stabilize the system.\n"
                "🔧 Suggested: help, wasm-test, memory\n"
                "⚠️  Force reboot may cause data corruption!\n",
                memory_status ? "✅" : "❌",
                memory_status ? "HEALTHY" : "CRITICAL",
                system_uptime);
        }
        
        return result;
    }
    
    // === 基本的なシェルコマンド ===
    else if (strcmp(command_str, "hello") == 0) {
        LOG_DEBUG("Hello command processed in C");
        return strdup("Hello from WASM Fake Shell!");
    } else if (strcmp(command_str, "help") == 0) {
        return strdup(
            "Available commands:\n"
            "  hello - Say hello\n"
            "  echo <message> - Echo a message\n"
            "  wasm-test - Prove this runs in WASM C\n"
            "\n"
            "🎮 Game Commands:\n"
            "  gamestart - System check & start Aizu Rehack Game (C validation)\n"
            "\n"
            "🔄 System Commands:\n"
            "  reboot - Safe system reboot with pre-check validation\n"
            "\n"
            "🚀 Performance Benchmark (WASM vs JavaScript):\n"
            "  matrixC <size> / matrixJs <size> - Matrix multiplication\n"
            "\n"
            "🔧 Utility Commands:\n"
            "  memory - Show WASM memory information\n"
            "  clear - Clear terminal screen\n"
            "  help - Show this help\n"
            "\n"
            "🏁 Try this for obvious speed difference:\n"
            "  matrixC 200 vs matrixJs 200\n"
            "\n"
            "💡 WASM excels at compute-intensive tasks!");
    } else if (strcmp(command_str, "pwd") == 0) {
        return strdup("/fake/shell/directory");
    } else if (strcmp(command_str, "ls") == 0) {
        return strdup("file1.txt  file2.txt  directory1/  directory2/");
    } else if (strcmp(command_str, "whoami") == 0) {
        return strdup("fake_user");
    } else if (strcmp(command_str, "date") == 0) {
        return strdup("Fake Date: 2024-01-01 12:00:00");
    } else if (strcmp(command_str, "clear") == 0) {
        return strdup("\033[2J\033[H"); // クリアのためにANSIエスケープコードを使う～
    }

    // なんだそのコマンドしらん！
    LOG_INFO("Unknown command in C: '%s'", command_str);
    char* error_msg = malloc(strlen(command_str) + 50);
    if (error_msg) {
        sprintf(error_msg, "bash: %s: command not found", command_str);
        return error_msg;
    }
    return strdup("Error: memory allocation failed");
}

// メモリ解放用
EMSCRIPTEN_KEEPALIVE
void free_string(char* ptr) {
    if (ptr) {
        LOG_DEBUG("Freeing memory at %p", ptr);
        free(ptr);
    }
}

int main() {
    LOG_INFO("WASM Fake Shell initialized");
    return 0;
} 