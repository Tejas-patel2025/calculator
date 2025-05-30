// DOM Elements
const display = document.querySelector('.calculator__display');
const keys = document.querySelectorAll('.key');
const themeInputs = document.querySelectorAll('input[name="theme"]');

// Calculator State
let currentInput = '0';
let previousInput = '';
let operator = '';
let shouldResetDisplay = false;

// Theme Handling
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('calculator-theme', theme);
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('calculator-theme');
    if (savedTheme) {
        setTheme(savedTheme);
        themeInputs.forEach(input => {
            if (input.value === savedTheme) input.checked = true;
        });
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const defaultTheme = prefersDark ? '3' : '1';
        setTheme(defaultTheme);
        document.getElementById(`theme${defaultTheme}`).checked = true;
    }
}

themeInputs.forEach(input => {
    input.addEventListener('change', () => {
        setTheme(input.value);
    });
});

// Calculator Logic
function updateDisplay() {
    display.textContent = currentInput;
}

function handleNumber(number) {
    if (shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        currentInput = currentInput === '0' ? number : currentInput + number;
    }
    updateDisplay();
}

function handleOperator(op) {
    if (operator && !shouldResetDisplay) {
        calculate();
    }
    previousInput = currentInput;
    operator = op === 'x' ? '*' : op;
    shouldResetDisplay = true;
}

function calculate() {
    if (!operator || !previousInput) return;
    try {
        const result = eval(`${previousInput} ${operator} ${currentInput}`);
        currentInput = Number.isFinite(result) ? result.toString() : 'Error';
        operator = '';
        previousInput = '';
        shouldResetDisplay = true;
        updateDisplay();
    } catch {
        currentInput = 'Error';
        updateDisplay();
        resetCalculator();
    }
}

function resetCalculator() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    if (shouldResetDisplay) return;
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
    updateDisplay();
}

// Key Event Listeners
keys.forEach(key => {
    key.addEventListener('click', () => {
        const value = key.textContent;

        if (key.classList.contains('key--number')) {
            handleNumber(value);
        } else if (key.classList.contains('key--operator')) {
            handleOperator(value);
        } else if (key.classList.contains('key--equals')) {
            calculate();
        } else if (key.classList.contains('key--reset')) {
            resetCalculator();
        } else if (key.classList.contains('key--del')) {
            deleteLast();
        }
    });
});

// Initialize
initializeTheme();
updateDisplay();