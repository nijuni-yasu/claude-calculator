/**
 * VibeCalc メインアプリケーション
 * イベントリスナーの設定とアプリケーションの初期化
 */
class VibeCalcApp {
    constructor() {
        this.isInitialized = false;
        this.init();
    }
    
    /**
     * アプリケーションを初期化
     */
    init() {
        // DOMの読み込み完了を待つ
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }
    
    /**
     * アプリケーションのセットアップ
     */
    setupApp() {
        if (this.isInitialized) return;
        
        try {
            // イベントリスナーを設定
            this.setupEventListeners();
            
            // 設定を初期化
            this.initializeSettings();
            
            // 履歴表示を更新
            if (window.calculator) {
                window.calculator.updateHistoryDisplay();
            }
            
            // 音声コンテキストを再開（ユーザーインタラクション後に必要）
            this.setupAudioContext();
            
            this.isInitialized = true;
            console.log('VibeCalc app initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize VibeCalc app:', error);
        }
    }
    
    /**
     * イベントリスナーを設定
     */
    setupEventListeners() {
        // 数字ボタンのイベントリスナー
        this.setupNumberButtons();
        
        // 演算子ボタンのイベントリスナー
        this.setupOperatorButtons();
        
        // 機能ボタンのイベントリスナー
        this.setupFunctionButtons();
        
        // 設定パネルのイベントリスナー
        this.setupSettingsPanel();
        
        // 履歴パネルのイベントリスナー
        this.setupHistoryPanel();
        
        // キーボードイベントリスナー
        this.setupKeyboardEvents();
        
        // タッチイベントリスナー（モバイル対応）
        this.setupTouchEvents();
    }
    
    /**
     * 数字ボタンのイベントリスナーを設定
     */
    setupNumberButtons() {
        const numberButtons = document.querySelectorAll('.number-btn');
        
        numberButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const number = e.target.dataset.number;
                if (number && window.calculator) {
                    if (number === '.') {
                        window.calculator.inputDecimal();
                    } else {
                        window.calculator.inputDigit(number);
                    }
                    
                    // ボタン押下アニメーション
                    this.addButtonPressAnimation(button);
                }
            });
        });
    }
    
    /**
     * 演算子ボタンのイベントリスナーを設定
     */
    setupOperatorButtons() {
        const operatorButtons = document.querySelectorAll('.operator-btn');
        
        operatorButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const operator = e.target.dataset.operator;
                if (operator && window.calculator) {
                    window.calculator.inputOperator(operator);
                    
                    // ボタン押下アニメーション
                    this.addButtonPressAnimation(button);
                }
            });
        });
    }
    
    /**
     * 機能ボタンのイベントリスナーを設定
     */
    setupFunctionButtons() {
        const functionButtons = document.querySelectorAll('.function-btn, .equals-btn');
        
        functionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action && window.calculator) {
                    switch (action) {
                        case 'clear':
                            window.calculator.clearAll();
                            break;
                        case 'clear-entry':
                            window.calculator.clearEntry();
                            break;
                        case 'backspace':
                            window.calculator.backspace();
                            break;
                        case 'equals':
                            window.calculator.performCalculation();
                            break;
                    }
                    
                    // ボタン押下アニメーション
                    this.addButtonPressAnimation(button);
                }
            });
        });
    }
    
    /**
     * 設定パネルのイベントリスナーを設定
     */
    setupSettingsPanel() {
        // 音量スライダー
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const volume = e.target.value / 100;
                if (window.soundManager) {
                    window.soundManager.setVolume(volume);
                }
            });
        }
        
        // 音声トグルボタン
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                if (window.soundManager) {
                    const isEnabled = window.soundManager.isEnabled();
                    window.soundManager.setEnabled(!isEnabled);
                    
                    // ボタンの表示を更新
                    soundToggle.textContent = isEnabled ? '🔇' : '🔊';
                    
                    // 設定をローカルストレージに保存
                    localStorage.setItem('vibecalc-sound-enabled', !isEnabled);
                }
            });
        }
    }
    
    /**
     * 履歴パネルのイベントリスナーを設定
     */
    setupHistoryPanel() {
        // 履歴クリアボタン
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                if (window.calculator) {
                    window.calculator.clearHistory();
                }
            });
        }
    }
    
    /**
     * キーボードイベントリスナーを設定
     */
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (!window.calculator) return;
            
            const key = e.key;
            
            // 数字キー
            if (/^[0-9]$/.test(key)) {
                window.calculator.inputDigit(key);
                this.highlightButton(`[data-number="${key}"]`);
            }
            
            // 演算子キー
            else if (['+', '-', '*', '/'].includes(key)) {
                let operator = key;
                if (key === '*') operator = '×';
                if (key === '/') operator = '÷';
                
                window.calculator.inputOperator(operator);
                this.highlightButton(`[data-operator="${operator}"]`);
            }
            
            // 小数点
            else if (key === '.') {
                window.calculator.inputDecimal();
                this.highlightButton('[data-number="."]');
            }
            
            // 等号
            else if (key === 'Enter' || key === '=') {
                window.calculator.performCalculation();
                this.highlightButton('[data-action="equals"]');
            }
            
            // バックスペース
            else if (key === 'Backspace') {
                window.calculator.backspace();
                this.highlightButton('[data-action="backspace"]');
            }
            
            // エスケープ（クリア）
            else if (key === 'Escape') {
                window.calculator.clearAll();
                this.highlightButton('[data-action="clear"]');
            }
            
            // 音声コンテキストを再開
            if (window.soundManager) {
                window.soundManager.resume();
            }
        });
    }
    
    /**
     * タッチイベントリスナーを設定（モバイル対応）
     */
    setupTouchEvents() {
        // タッチデバイスでのホバー効果を無効化
        if ('ontouchstart' in window) {
            const buttons = document.querySelectorAll('.calc-btn');
            buttons.forEach(button => {
                button.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.addButtonPressAnimation(button);
                });
            });
        }
    }
    
    /**
     * ボタン押下アニメーションを追加
     * @param {HTMLElement} button - アニメーションを追加するボタン
     */
    addButtonPressAnimation(button) {
        button.classList.add('button-press');
        setTimeout(() => {
            button.classList.remove('button-press');
        }, 100);
    }
    
    /**
     * ボタンをハイライト
     * @param {string} selector - ボタンのセレクター
     */
    highlightButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            button.classList.add('button-press');
            setTimeout(() => {
                button.classList.remove('button-press');
            }, 100);
        }
    }
    
    /**
     * 設定を初期化
     */
    initializeSettings() {
        // 音声設定を読み込み
        const soundEnabled = localStorage.getItem('vibecalc-sound-enabled');
        if (soundEnabled !== null && window.soundManager) {
            const enabled = soundEnabled === 'true';
            window.soundManager.setEnabled(enabled);
            
            // ボタンの表示を更新
            const soundToggle = document.getElementById('soundToggle');
            if (soundToggle) {
                soundToggle.textContent = enabled ? '🔊' : '🔇';
            }
        }
        
        // 音量設定を読み込み
        const savedVolume = localStorage.getItem('vibecalc-volume');
        if (savedVolume !== null && window.soundManager) {
            const volume = parseFloat(savedVolume);
            window.soundManager.setVolume(volume);
            
            // スライダーの値を更新
            const volumeSlider = document.getElementById('volumeSlider');
            if (volumeSlider) {
                volumeSlider.value = volume * 100;
            }
        }
    }
    
    /**
     * 音声コンテキストをセットアップ
     */
    setupAudioContext() {
        // ユーザーインタラクション後に音声コンテキストを再開
        const resumeAudio = () => {
            if (window.soundManager) {
                window.soundManager.resume();
            }
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('keydown', resumeAudio);
            document.removeEventListener('touchstart', resumeAudio);
        };
        
        document.addEventListener('click', resumeAudio);
        document.addEventListener('keydown', resumeAudio);
        document.addEventListener('touchstart', resumeAudio);
    }
    
    /**
     * アプリケーションの状態を取得
     * @returns {Object} アプリケーションの状態
     */
    getAppState() {
        return {
            isInitialized: this.isInitialized,
            calculator: window.calculator ? {
                display: window.calculator.getDisplayValue(),
                history: window.calculator.getHistory()
            } : null,
            soundManager: window.soundManager ? {
                enabled: window.soundManager.isEnabled(),
                volume: window.soundManager.getVolume()
            } : null,
            themeManager: window.themeManager ? {
                currentTheme: window.themeManager.getCurrentTheme()
            } : null
        };
    }
    
    /**
     * アプリケーションをリセット
     */
    reset() {
        if (window.calculator) {
            window.calculator.reset();
        }
        
        if (window.soundManager) {
            window.soundManager.setVolume(0.5);
            window.soundManager.setEnabled(true);
        }
        
        if (window.themeManager) {
            window.themeManager.switchTheme('neon');
        }
        
        // ローカルストレージをクリア
        localStorage.removeItem('vibecalc-history');
        localStorage.removeItem('vibecalc-theme');
        localStorage.removeItem('vibecalc-sound-enabled');
        localStorage.removeItem('vibecalc-volume');
        
        console.log('VibeCalc app reset');
    }
}

// アプリケーションを開始
window.vibeCalcApp = new VibeCalcApp();

// グローバル関数として公開（デバッグ用）
window.getVibeCalcState = () => window.vibeCalcApp.getAppState();
window.resetVibeCalc = () => window.vibeCalcApp.reset(); 