/**
 * VibeCalc 音声管理クラス
 * Web Audio APIを使用して音声を生成・管理
 */
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.volume = 0.5;
        this.enabled = true;
        this.currentTheme = 'neon';
        
        // 音階の周波数（C4からB4まで）
        this.notes = {
            '0': 261.63, // C4
            '1': 277.18, // C#4
            '2': 293.66, // D4
            '3': 311.13, // D#4
            '4': 329.63, // E4
            '5': 349.23, // F4
            '6': 369.99, // F#4
            '7': 392.00, // G4
            '8': 415.30, // G#4
            '9': 440.00, // A4
            '+': 523.25, // C5
            '-': 493.88, // B4
            '×': 587.33, // D5
            '÷': 659.25, // E5
            '=': 698.46, // F5
            'AC': 174.61, // F3
            'C': 196.00, // G3
            '⌫': 220.00  // A3
        };
        
        // テーマ別の音色設定
        this.themeSounds = {
            neon: {
                type: 'square',
                attack: 0.01,
                decay: 0.1,
                sustain: 0.3,
                release: 0.2
            },
            nature: {
                type: 'sine',
                attack: 0.1,
                decay: 0.3,
                sustain: 0.5,
                release: 0.5
            },
            synthwave: {
                type: 'sawtooth',
                attack: 0.05,
                decay: 0.2,
                sustain: 0.4,
                release: 0.3
            },
            zen: {
                type: 'triangle',
                attack: 0.2,
                decay: 0.5,
                sustain: 0.3,
                release: 0.8
            }
        };
        
        this.init();
    }
    
    /**
     * 音声コンテキストを初期化
     */
    init() {
        try {
            // Web Audio APIのサポートチェック
            if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
                this.audioContext = new (AudioContext || webkitAudioContext)();
                console.log('SoundManager initialized successfully');
            } else {
                console.warn('Web Audio API not supported');
                this.enabled = false;
            }
        } catch (error) {
            console.error('Failed to initialize SoundManager:', error);
            this.enabled = false;
        }
    }
    
    /**
     * 音声を再生
     * @param {string} key - ボタンのキー
     */
    playButtonSound(key) {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            const frequency = this.notes[key] || 440;
            const soundConfig = this.themeSounds[this.currentTheme];
            
            // オシレーターを作成
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // 音色を設定
            oscillator.type = soundConfig.type;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            // 音量エンベロープを設定
            const now = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(this.volume, now + soundConfig.attack);
            gainNode.gain.linearRampToValueAtTime(this.volume * soundConfig.sustain, now + soundConfig.attack + soundConfig.decay);
            gainNode.gain.linearRampToValueAtTime(0, now + soundConfig.attack + soundConfig.decay + soundConfig.release);
            
            // 接続して再生
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(now);
            oscillator.stop(now + soundConfig.attack + soundConfig.decay + soundConfig.release);
            
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }
    
    /**
     * 計算完了音を再生
     */
    playCalculationSound() {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            const soundConfig = this.themeSounds[this.currentTheme];
            const now = this.audioContext.currentTime;
            
            // 和音を作成（C, E, G）
            const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
            
            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.type = soundConfig.type;
                oscillator.frequency.setValueAtTime(freq, now);
                
                // 遅延を付けて和音を奏でる
                const delay = index * 0.1;
                gainNode.gain.setValueAtTime(0, now + delay);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, now + delay + soundConfig.attack);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.3 * soundConfig.sustain, now + delay + soundConfig.attack + soundConfig.decay);
                gainNode.gain.linearRampToValueAtTime(0, now + delay + soundConfig.attack + soundConfig.decay + soundConfig.release);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.start(now + delay);
                oscillator.stop(now + delay + soundConfig.attack + soundConfig.decay + soundConfig.release);
            });
            
        } catch (error) {
            console.error('Error playing calculation sound:', error);
        }
    }
    
    /**
     * エラー音を再生
     */
    playErrorSound() {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            const soundConfig = this.themeSounds[this.currentTheme];
            const now = this.audioContext.currentTime;
            
            // 不協和音を作成（C, C#）
            const frequencies = [261.63, 277.18]; // C4, C#4
            
            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.type = soundConfig.type;
                oscillator.frequency.setValueAtTime(freq, now);
                
                // 短い不協和音
                const duration = 0.3;
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.4, now + 0.05);
                gainNode.gain.linearRampToValueAtTime(0, now + duration);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.start(now);
                oscillator.stop(now + duration);
            });
            
        } catch (error) {
            console.error('Error playing error sound:', error);
        }
    }
    
    /**
     * 音量を設定
     * @param {number} volume - 音量（0-1）
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
    
    /**
     * テーマを設定
     * @param {string} theme - テーマ名
     */
    setTheme(theme) {
        if (this.themeSounds[theme]) {
            this.currentTheme = theme;
        }
    }
    
    /**
     * 音声の有効/無効を切り替え
     * @param {boolean} enabled - 有効にするかどうか
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    /**
     * 音声の有効/無効状態を取得
     * @returns {boolean} 有効かどうか
     */
    isEnabled() {
        return this.enabled;
    }
    
    /**
     * 現在の音量を取得
     * @returns {number} 音量（0-1）
     */
    getVolume() {
        return this.volume;
    }
    
    /**
     * 音声コンテキストを再開（ユーザーインタラクション後に必要）
     */
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    /**
     * 音声コンテキストを停止
     */
    suspend() {
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
    }
}

// グローバルインスタンスを作成
window.soundManager = new SoundManager(); 