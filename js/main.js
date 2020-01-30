const displayOperation = document.querySelector('#displayOperation');
const displayResult = document.querySelector('#displayResult');
const buttons = Array.from(document.getElementById('buttons').querySelectorAll('div'));

const input = [];
const indexOp = [];
let result;
let shiftResult;

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        button.classList.add('push');
        if (overflow(button.classList[0])) return;
        shiftResultToDisplay();
        this[button.classList[0]](e.target.textContent, e.target.id);
    })
})

window.addEventListener('keydown', (e) => {
    e.preventDefault();
    const button = document.querySelector(`div[data-key="${e.keyCode}"]`);
    button.classList.add('push');
    if (!button) return;
    if (overflow(button.classList[0])) return;
    shiftResultToDisplay();
    this[button.classList[0]](button.textContent, button.id);
    console.log(input)
})

buttons.forEach(button => button.addEventListener('transitionend', removeTransition));

function overflow(funct){
    return input.length > 20 && (funct != 'insertBackspace' && funct != 'clear');
}

function operate() {
    if (hasNumber(input[input.length - 1])) {
        let a = parseFloat(input.slice(0, indexOp[0]).join(''));
        let operator = input.slice(indexOp[0], indexOp[0] + 1).join('');
        let b = parseFloat(input.slice(indexOp[0] + 1).join(''));
        switch(operator){
            case 'add': result = add(a, b); break;
            case 'subtract': result = subtract(a, b); break;
            case 'multiply': result = multiply(a, b); break;
            case 'divide': result = divide(a, b); break;
            default: break;
        }
        result = Math.round(result*1000000)/1000000;
        if (result.toString().length < 15) {
            indexOp.shift();
            if (indexOp.length != 0) {
                input.splice(0, indexOp[0]);
                input.unshift(...result.toString().split(''));
                indexOp.forEach((index,i) => {
                    indexOp[i] = index - (result.toString().length + 1);
                })
                operate();
            }
            input.length = 0;
            input.unshift(...result.toString().split(''));
            displayResult.textContent = result;
            shiftResult = 1;
        }
        else displayResult.textContent = 'COVFEFE';
    }
}

function insertNumber(number) {
    input.push(number);
    displayOperation.textContent += number;
}

function insertOperator(operator, functionName) {
    if (hasNumber(input[input.length - 1])) {
        indexOp.push(input.length);
        input.push(functionName);
        displayOperation.textContent += operator;
    }
}

function insertDecimal() {
    let decimalCheck = input.slice(indexOp[indexOp.length - 1]);
    if (!decimalCheck.some(x => x == '.')) {
        if (!hasNumber(input[input.length - 1])) {
            input.push('0');
            input.push('.');
            displayOperation.textContent += '0.';
        }
        else {
            input.push('.');
            displayOperation.textContent += '.';
        }
    }
}

function insertPlusMinus() {
    let index;
    indexOp.length == 0 ? index = 0 : index = indexOp[indexOp.length - 1] + 1;
    input[index] != '-' ? changeSign(index, 0, '-') : changeSign(index, 1);
}

function changeSign (start, howMany, item) {
    input.splice(start, howMany, item);
    processed = displayOperation.textContent.split('');
    processed.splice(start, howMany, item);
    displayOperation.textContent = processed.join('');
}

function insertBackspace() {
    input.pop();
    if (input.length == indexOp[indexOp.length - 1]) indexOp.pop();
    displayOperation.textContent = displayOperation.textContent.slice(0, -1);
}

function clear() {
    input.length = 0;
    indexOp.length = 0;
    displayOperation.textContent = '';
    displayResult.textContent = '';
}

function hasNumber(string) {
    return /\d/.test(string);
}

function shiftResultToDisplay() {
    if (shiftResult == 1) {
        displayOperation.textContent = input.join('');
        shiftResult = 0;
    }
}

function removeTransition(e) {
    if (e.propertyName !== 'box-shadow') return;
    e.target.classList.remove('push');
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return b != 0 ? 
        Math.round(a / b * Math.pow(10, 6)) / Math.pow(10, 6) : "COVFEFE";
}