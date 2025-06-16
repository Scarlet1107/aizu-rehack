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