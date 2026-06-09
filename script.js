// ===== DOM取得 =====
const resultEl     = document.getElementById('result');
const expressionEl = document.getElementById('expression');

// ===== 状態管理 =====
let currentInput  = '0';
let previousInput = '';
let operator      = null;
let shouldReset   = false;

// ===== 表示更新 =====
function updateDisplay() {
  resultEl.textContent = currentInput;
}

// ===== イベントリスナー（1つにまとめる）=====
document.querySelector('.buttons').addEventListener('click', (event) => {
  const btn = event.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;
  const value  = btn.dataset.value;

  if (action) {
    handleAction(action);
  } else if (['+', '-', '*', '/'].includes(value)) {
    setOperator(value);
  } else if (value !== undefined) {
    handleInput(value);
  }
});

// ===== 数字・小数点入力 =====
function handleInput(value) {
  if (value === '.' && currentInput.includes('.')) return;
  if (currentInput === '0' && value !== '.') {
    currentInput = value;
  } else if (shouldReset) {
    currentInput = value;
    shouldReset = false;
  } else {
    if (currentInput.length >= 10) return;
    currentInput += value;
  }
  updateDisplay();
}

// ===== アクション処理 =====
function handleAction(action) {
  switch (action) {
    case 'clear':   clear();       break;
    case 'sign':    toggleSign();  break;
    case 'percent': toPercent();   break;
    case 'equal':   calculate();   break;
  }
}

// ===== 演算子セット =====
function setOperator(op) {
  if (operator && !shouldReset) calculate();
  previousInput = currentInput;
  operator = op;
  shouldReset = true;
  expressionEl.textContent = `${previousInput} ${opSymbol(op)}`;
}

// ===== 計算実行 =====
function calculate() {
  if (!operator || shouldReset) return;
  const a = parseFloat(previousInput);
  const b = parseFloat(currentInput);
  let result;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/':
      if (b === 0) {
        currentInput = 'Error';
        updateDisplay();
        operator = null; shouldReset = false;
        return;
      }
      result = a / b;
      break;
  }
  expressionEl.textContent = `${previousInput} ${opSymbol(operator)} ${currentInput} =`;
  currentInput = String(parseFloat(result.toFixed(10)));
  operator = null;
  shouldReset = true;
  updateDisplay();
}

// ===== ユーティリティ =====
function clear() {
  currentInput = '0'; previousInput = '';
  operator = null; shouldReset = false;
  expressionEl.textContent = '';
  updateDisplay();
}
function toggleSign() {
  currentInput = String(parseFloat(currentInput) * -1);
  updateDisplay();
}
function toPercent() {
  currentInput = String(parseFloat(currentInput) / 100);
  updateDisplay();
}
function opSymbol(op) {
  return { '+': '+', '-': '−', '*': '×', '/': '÷' }[op] || op;
}