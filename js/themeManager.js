/**
 * VibeCalc テーマ管理クラス
 * テーマの切り替えとアニメーションを管理
 */
class ThemeManager {
    constructor() {
        this.currentTheme = 'neon';
        this.themes = ['neon', 'nature', 'synthwave', 'zen'];
        this.isTransitioning = false;
        
        this.init();
    }
    
    /**
     * テーママネージャーを初期化
     */
    init() {
        // ローカルストレージから保存されたテーマを読み込み
        const savedTheme = localStorage.getItem('vibecalc-theme');
        if (savedTheme && this.themes.includes(savedTheme)) {
            this.currentTheme = savedTheme;
        }
        
        // 初期テーマを適用
        this.applyTheme(this.currentTheme);
        
        // テーマボタンのイベントリスナーを設定
        this.setupThemeButtons();
        
        console.log('ThemeManager initialized with theme:', this.currentTheme);
    }
    
    /**
     * テーマボタンのイベントリスナーを設定
     */
    setupThemeButtons() {
        const themeButtons = document.querySelectorAll('.theme-btn');
        
        themeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                if (theme && this.themes.includes(theme)) {
                    this.switchTheme(theme);
                }
            });
        });
    }
    
    /**
     * テーマを切り替え
     * @param {string} theme - 新しいテーマ名
     */
    switchTheme(theme) {
        if (this.isTransitioning || theme === this.currentTheme) return;
        
        this.isTransitioning = true;
        
        // テーマ切り替えアニメーションを開始
        this.startThemeTransition(() => {
            this.applyTheme(theme);
            this.updateThemeButtons(theme);
            this.currentTheme = theme;
            
            // ローカルストレージに保存
            localStorage.setItem('vibecalc-theme', theme);
            
            // 音声マネージャーのテーマも更新
            if (window.soundManager) {
                window.soundManager.setTheme(theme);
            }
            
            // テーマ切り替えアニメーションを終了
            this.endThemeTransition();
            
            console.log('Theme switched to:', theme);
        });
    }
    
    /**
     * テーマ切り替えアニメーションを開始
     * @param {Function} callback - アニメーション完了後のコールバック
     */
    startThemeTransition(callback) {
        const container = document.querySelector('.calculator-container');
        if (!container) return;
        
        // フェードアウト効果
        container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        container.style.opacity = '0.5';
        container.style.transform = 'scale(0.98)';
        
        // アニメーション完了後にコールバックを実行
        setTimeout(() => {
            if (callback) callback();
        }, 150);
    }
    
    /**
     * テーマ切り替えアニメーションを終了
     */
    endThemeTransition() {
        const container = document.querySelector('.calculator-container');
        if (!container) return;
        
        // フェードイン効果
        container.style.opacity = '1';
        container.style.transform = 'scale(1)';
        
        // トランジション完了後にスタイルをリセット
        setTimeout(() => {
            container.style.transition = '';
            this.isTransitioning = false;
        }, 300);
    }
    
    /**
     * テーマを適用
     * @param {string} theme - 適用するテーマ名
     */
    applyTheme(theme) {
        const container = document.querySelector('.calculator-container');
        if (!container) return;
        
        // 既存のテーマクラスを削除
        this.themes.forEach(t => {
            container.classList.remove(`theme-${t}`);
        });
        
        // 新しいテーマクラスを追加
        container.classList.add(`theme-${theme}`);
        
        // テーマ固有の初期化処理
        this.initializeThemeFeatures(theme);
    }
    
    /**
     * テーマ固有の機能を初期化
     * @param {string} theme - テーマ名
     */
    initializeThemeFeatures(theme) {
        switch (theme) {
            case 'neon':
                this.initializeNeonTheme();
                break;
            case 'nature':
                this.initializeNatureTheme();
                break;
            case 'synthwave':
                this.initializeSynthwaveTheme();
                break;
            case 'zen':
                this.initializeZenTheme();
                break;
        }
    }
    
    /**
     * Neonテーマの初期化
     */
    initializeNeonTheme() {
        // スキャンライン効果の開始
        this.startScanlineEffect();
        
        // ネオングロー効果の強化
        const buttons = document.querySelectorAll('.calc-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.boxShadow = '0 0 20px var(--primary-color), 0 0 30px var(--primary-color)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.boxShadow = '';
            });
        });
    }
    
    /**
     * Natureテーマの初期化
     */
    initializeNatureTheme() {
        // 葉っぱの揺れ効果を開始
        this.startLeafSwayEffect();
        
        // 自然の呼吸効果
        const calculator = document.querySelector('.calculator');
        if (calculator) {
            calculator.style.animation = 'nature-breathe 4s ease-in-out infinite';
        }
    }
    
    /**
     * Synthwaveテーマの初期化
     */
    initializeSynthwaveTheme() {
        // グリッド効果の開始
        this.startGridEffect();
        
        // レトロフォント効果
        const title = document.querySelector('.calculator-title');
        if (title) {
            title.style.textTransform = 'uppercase';
            title.style.fontWeight = '900';
        }
    }
    
    /**
     * Zenテーマの初期化
     */
    initializeZenTheme() {
        // 禅の円効果を開始
        this.startZenCircleEffect();
        
        // 静寂の波効果
        const calculator = document.querySelector('.calculator');
        if (calculator) {
            calculator.style.animation = 'zen-wave 12s ease-in-out infinite';
        }
    }
    
    /**
     * スキャンライン効果を開始
     */
    startScanlineEffect() {
        const calculator = document.querySelector('.calculator');
        if (!calculator) return;
        
        // 既存のスキャンラインを削除
        const existingScanline = calculator.querySelector('.scanline');
        if (existingScanline) {
            existingScanline.remove();
        }
        
        // 新しいスキャンラインを作成
        const scanline = document.createElement('div');
        scanline.className = 'scanline';
        scanline.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
            animation: scanline 2s linear infinite;
            pointer-events: none;
            z-index: 10;
        `;
        
        calculator.appendChild(scanline);
    }
    
    /**
     * 葉っぱの揺れ効果を開始
     */
    startLeafSwayEffect() {
        const buttons = document.querySelectorAll('.calc-btn');
        buttons.forEach((button, index) => {
            const delay = index * 0.1;
            button.style.animationDelay = `${delay}s`;
        });
    }
    
    /**
     * グリッド効果を開始
     */
    startGridEffect() {
        const calculator = document.querySelector('.calculator');
        if (!calculator) return;
        
        // 既存のグリッドを削除
        const existingGrid = calculator.querySelector('.grid-overlay');
        if (existingGrid) {
            existingGrid.remove();
        }
        
        // 新しいグリッドを作成
        const grid = document.createElement('div');
        grid.className = 'grid-overlay';
        grid.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
                linear-gradient(rgba(255, 0, 128, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 0, 128, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
            pointer-events: none;
            animation: grid-move 10s linear infinite;
            z-index: 5;
        `;
        
        calculator.appendChild(grid);
    }
    
    /**
     * 禅の円効果を開始
     */
    startZenCircleEffect() {
        const buttons = document.querySelectorAll('.calc-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                const circle = document.createElement('div');
                circle.className = 'zen-circle';
                circle.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    background: rgba(243, 244, 246, 0.1);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    transition: all 0.6s ease;
                    pointer-events: none;
                    z-index: 5;
                `;
                
                button.appendChild(circle);
                
                // 円を拡大
                setTimeout(() => {
                    circle.style.width = '100px';
                    circle.style.height = '100px';
                }, 10);
                
                // 円を削除
                setTimeout(() => {
                    if (circle.parentNode) {
                        circle.remove();
                    }
                }, 600);
            });
        });
    }
    
    /**
     * テーマボタンの状態を更新
     * @param {string} activeTheme - アクティブなテーマ名
     */
    updateThemeButtons(activeTheme) {
        const themeButtons = document.querySelectorAll('.theme-btn');
        
        themeButtons.forEach(button => {
            const theme = button.dataset.theme;
            if (theme === activeTheme) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    /**
     * 現在のテーマを取得
     * @returns {string} 現在のテーマ名
     */
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    /**
     * 利用可能なテーマのリストを取得
     * @returns {Array} テーマ名の配列
     */
    getAvailableThemes() {
        return [...this.themes];
    }
    
    /**
     * テーマ切り替え中かどうかを取得
     * @returns {boolean} 切り替え中かどうか
     */
    isTransitioning() {
        return this.isTransitioning;
    }
}

// グローバルインスタンスを作成
window.themeManager = new ThemeManager(); 