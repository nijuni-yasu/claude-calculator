/**
 * VibeCalc 計算ロジッククラス
 * 基本的な計算機能と履歴管理を提供
 */
class Calculator {
    constructor() {
        this.display = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
        this.history = [];
        this.maxHistoryItems = 10;
        
        this.init();
    }
    
    /**
     * 計算機を初期化
     */
    init() {
        // ローカルストレージから履歴を読み込み
        this.loadHistory();
        
        // 表示を更新
        this.updateDisplay();
        
        console.log('Calculator initialized');
    }
    
    /**
     * 数字を入力
     * @param {string} digit - 入力する数字
     */
    inputDigit(digit) {
        console.log('=== Input digit ===');
        console.log('Digit:', digit);
        console.log('Current display:', this.display);
        console.log('Waiting for operand:', this.waitingForOperand);
        
        if (this.waitingForOperand) {
            this.display = digit;
            this.waitingForOperand = false;
            console.log('Reset display to:', this.display);
        } else {
            this.display = this.display === '0' ? digit : this.display + digit;
            console.log('Updated display to:', this.display);
        }
        
        this.updateDisplay();
        this.playButtonSound(digit);
        console.log('=== Digit input completed ===');
    }
    
    /**
     * 小数点を入力
     */
    inputDecimal() {
        if (this.waitingForOperand) {
            this.display = '0.';
            this.waitingForOperand = false;
        } else if (this.display.indexOf('.') === -1) {
            this.display += '.';
        }
        
        this.updateDisplay();
        this.playButtonSound('.');
    }
    
    /**
     * 演算子を入力
     * @param {string} nextOperation - 演算子
     */
    inputOperator(nextOperation) {
        console.log('=== Input operator ===');
        console.log('Operator:', nextOperation);
        console.log('Current display:', this.display);
        console.log('Previous value:', this.previousValue);
        console.log('Current operation:', this.operation);
        
        const inputValue = parseFloat(this.display);
        console.log('Input value:', inputValue);
        
        if (this.previousValue === null) {
            this.previousValue = inputValue;
            console.log('Set previous value:', this.previousValue);
        } else if (this.operation) {
            const currentValue = this.previousValue || 0;
            const newValue = this.performCalculation(currentValue, inputValue, this.operation);
            console.log('Chained calculation:', currentValue, this.operation, inputValue, '=', newValue);
            
            this.display = String(newValue);
            this.previousValue = newValue;
        }
        
        this.waitingForOperand = true;
        this.operation = nextOperation;
        console.log('Set operation:', this.operation);
        console.log('Set waiting for operand:', this.waitingForOperand);
        
        this.updateDisplay();
        this.playButtonSound(nextOperation);
        console.log('=== Operator input completed ===');
    }
    
    /**
     * 計算を実行
     * @param {number} firstValue - 第1オペランド
     * @param {number} secondValue - 第2オペランド
     * @param {string} operation - 演算子
     * @returns {number} 計算結果
     */
    performCalculation(firstValue, secondValue, operation) {
        switch (operation) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '×':
                return firstValue * secondValue;
            case '÷':
                if (secondValue === 0) {
                    this.showError('ゼロで割ることはできません');
                    return firstValue;
                }
                return firstValue / secondValue;
            default:
                return secondValue;
        }
    }
    
    /**
     * 等号を押した時の処理
     */
    calculate() {
        console.log('=== Calculate method called ===');
        console.log('Current display:', this.display);
        console.log('Previous value:', this.previousValue);
        console.log('Operation:', this.operation);
        console.log('Waiting for operand:', this.waitingForOperand);
        
        const inputValue = parseFloat(this.display);
        console.log('Input value:', inputValue);
        
        if (this.previousValue === null || this.operation === null) {
            console.log('Cannot calculate: missing previous value or operation');
            return;
        }
        
        const currentValue = this.previousValue || 0;
        const newValue = this.performCalculation(currentValue, inputValue, this.operation);
        console.log('Calculation result:', newValue);
        
        // 履歴に追加
        const historyItem = {
            expression: `${currentValue} ${this.operation} ${inputValue}`,
            result: String(newValue),
            timestamp: new Date()
        };
        
        this.addToHistory(historyItem);
        
        this.display = String(newValue);
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = true;
        
        this.updateDisplay();
        this.playCalculationSound();
        console.log('=== Calculation completed ===');
    }
    
    /**
     * 全クリア
     */
    clearAll() {
        this.display = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
        
        this.updateDisplay();
        this.playButtonSound('AC');
    }
    
    /**
     * 現在の入力のみクリア
     */
    clearEntry() {
        this.display = '0';
        this.waitingForOperand = false;
        
        this.updateDisplay();
        this.playButtonSound('C');
    }
    
    /**
     * バックスペース
     */
    backspace() {
        if (this.waitingForOperand) {
            return;
        }
        
        this.display = this.display.length === 1 ? '0' : this.display.slice(0, -1);
        
        this.updateDisplay();
        this.playButtonSound('⌫');
    }
    
    /**
     * 表示を更新
     */
    updateDisplay() {
        const mainDisplay = document.getElementById('mainDisplay');
        const historyDisplay = document.getElementById('historyDisplay');
        
        if (mainDisplay) {
            // 数値のフォーマット
            const displayValue = this.formatDisplayValue(this.display);
            mainDisplay.textContent = displayValue;
            
            // 更新アニメーション
            mainDisplay.classList.add('updating');
            setTimeout(() => {
                mainDisplay.classList.remove('updating');
            }, 200);
        }
        
        if (historyDisplay) {
            // 計算式を表示
            let historyText = '';
            if (this.previousValue !== null && this.operation) {
                historyText = `${this.previousValue} ${this.operation}`;
            }
            historyDisplay.textContent = historyText;
        }
    }
    
    /**
     * 表示値をフォーマット
     * @param {string} value - フォーマットする値
     * @returns {string} フォーマットされた値
     */
    formatDisplayValue(value) {
        const num = parseFloat(value);
        
        if (isNaN(num)) {
            return 'Error';
        }
        
        // 整数の場合は整数として表示
        if (Number.isInteger(num)) {
            return num.toString();
        }
        
        // 小数点以下は最大8桁まで表示
        return num.toFixed(8).replace(/\.?0+$/, '');
    }
    
    /**
     * 履歴に追加
     * @param {Object} item - 履歴アイテム
     */
    addToHistory(item) {
        this.history.unshift(item);
        
        // 最大履歴数を超えた場合、古いものを削除
        if (this.history.length > this.maxHistoryItems) {
            this.history = this.history.slice(0, this.maxHistoryItems);
        }
        
        // ローカルストレージに保存
        this.saveHistory();
        
        // 履歴表示を更新
        this.updateHistoryDisplay();
    }
    
    /**
     * 履歴表示を更新
     */
    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
        
        historyList.innerHTML = '';
        
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const expression = document.createElement('span');
            expression.textContent = item.expression;
            
            const result = document.createElement('span');
            result.textContent = `= ${item.result}`;
            
            historyItem.appendChild(expression);
            historyItem.appendChild(result);
            historyList.appendChild(historyItem);
        });
    }
    
    /**
     * 履歴をクリア
     */
    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.updateHistoryDisplay();
    }
    
    /**
     * 履歴をローカルストレージに保存
     */
    saveHistory() {
        try {
            localStorage.setItem('vibecalc-history', JSON.stringify(this.history));
        } catch (error) {
            console.error('Failed to save history:', error);
        }
    }
    
    /**
     * 履歴をローカルストレージから読み込み
     */
    loadHistory() {
        try {
            const savedHistory = localStorage.getItem('vibecalc-history');
            if (savedHistory) {
                this.history = JSON.parse(savedHistory);
            }
        } catch (error) {
            console.error('Failed to load history:', error);
            this.history = [];
        }
    }
    
    /**
     * エラーを表示
     * @param {string} message - エラーメッセージ
     */
    showError(message) {
        const mainDisplay = document.getElementById('mainDisplay');
        if (mainDisplay) {
            mainDisplay.textContent = message;
            mainDisplay.classList.add('error');
            
            // エラー音を再生
            this.playErrorSound();
            
            // 3秒後にエラー表示をクリア
            setTimeout(() => {
                mainDisplay.classList.remove('error');
                this.clearEntry();
            }, 3000);
        }
    }
    
    /**
     * ボタン音を再生
     * @param {string} key - ボタンのキー
     */
    playButtonSound(key) {
        if (window.soundManager && window.soundManager.isEnabled()) {
            window.soundManager.playButtonSound(key);
        }
    }
    
    /**
     * 計算完了音を再生
     */
    playCalculationSound() {
        if (window.soundManager && window.soundManager.isEnabled()) {
            window.soundManager.playCalculationSound();
        }
    }
    
    /**
     * エラー音を再生
     */
    playErrorSound() {
        if (window.soundManager && window.soundManager.isEnabled()) {
            window.soundManager.playErrorSound();
        }
    }
    
    /**
     * 現在の表示値を取得
     * @returns {string} 現在の表示値
     */
    getDisplayValue() {
        return this.display;
    }
    
    /**
     * 履歴を取得
     * @returns {Array} 履歴の配列
     */
    getHistory() {
        return [...this.history];
    }
    
    /**
     * 計算機の状態をリセット
     */
    reset() {
        this.display = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
        this.updateDisplay();
    }
}

// グローバルインスタンスを作成
window.calculator = new Calculator(); 