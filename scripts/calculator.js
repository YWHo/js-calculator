'use strict';

document.addEventListener('DOMContentLoaded', startCalculator);

var bufferEntry = [];
var entryStr = "0";
var hasDecimal = false;
var isBlockMode = false;
var isDivByZeroLockup = false;
var doneEqual = false;
var dingSound;

function startCalculator() {
    document.getElementById("button0").addEventListener("click", numButtonClicked);

    Array.from(document.getElementsByClassName("numButtons")).forEach(button => button.addEventListener("click", numButtonClicked));
    document.getElementById("buttonDel").addEventListener("click", delButtonClicked);
    document.getElementById("buttonDot").addEventListener("click", dotButtonClicked);
    document.getElementById("buttonCE").addEventListener("click", clearEntryClicked);
    document.getElementById("buttonAC").addEventListener("click", allClearClicked);
    document.getElementById("buttonAdd").addEventListener("click", addButtonClicked);
    document.getElementById("buttonSub").addEventListener("click", subButtonClicked);
    document.getElementById("buttonEql").addEventListener("click", equalButtonClicked);
    document.getElementById("buttonMul").addEventListener("click", mulButtonClicked);
    document.getElementById("buttonDiv").addEventListener("click", divButtonClicked);
    document.getElementById("buttonRECIP").addEventListener("click", recipButtonClicked);

    // initialize sound element
    dingSound = document.getElementById("dingSound");

}

function numButtonClicked(evt) {
    if (isDivByZeroLockup) {
        playDingSound();
        return;
    }

    if (isTooLong(entryStr)) {
        playDingSound();
        return;
    }

    if (entryStr === "0") {
        entryStr = getString(evt.target.innerText);
    } else if (doneEqual) {
        entryStr = evt.target.innerText;
        doneEqual = false;
    } else {
        entryStr += evt.target.innerText;
    }

    document.getElementById("resultText").innerHTML = entryStr;
    isBlockMode = false;
}

function delButtonClicked(evt) {
    if (isDivByZeroLockup) {
        playDingSound();
        return;
    }

    if (isBlockMode) {
        playDingSound();
        return;
    }

    if (entryStr[entryStr.length - 1] === ".") {
        hasDecimal = false;
    }

    let numStr = entryStr.slice(0, -1);
    if (numStr.length == 0) {
        resetEntry();
    } else {
        entryStr = numStr;
    }
    document.getElementById("resultText").innerHTML = entryStr;
}

function dotButtonClicked(evt) {
    if (isDivByZeroLockup) {
        playDingSound();
        return;
    }

    if (doneEqual) {
        entryStr = "0";
        doneEqual = false;
    } else if (hasDecimal) {
        playDingSound();
        return;
    }
    hasDecimal = true;
    entryStr += ".";
    document.getElementById("resultText").innerHTML = entryStr;
}

function addButtonClicked(evt) {
    doOperation("+");
}

function subButtonClicked(evt) {
    doOperation("-");
}

function mulButtonClicked(evt) {
    doOperation("*");
}

function divButtonClicked(evt) {
    doOperation("/");
}

function doOperation(opr) {
    if (isDivByZeroLockup) {
        playDingSound();
        return;
    }

    if (isBlockMode) {
        bufferEntry.pop();
        bufferEntry.push(opr);
    } else {
        bufferEntry.push(entryStr);
        bufferEntry.push(opr);
        calculate();
        entryStr = "0";
    }

    displayBufferEntry();
    isBlockMode = true;
    hasDecimal = false;
}

function recipButtonClicked(evt) {
    if (isDivByZeroLockup) {
        playDingSound();
        return;
    }

    if (entryStr === "0") {
        setDivideByZeroLockup();
        playDingSound();
        return;
    }
}

function equalButtonClicked(evt) {
    if (isDivByZeroLockup) {
        playDingSound();
        return;
    }

    bufferEntry.push(entryStr);
    entryStr = calculate();
    clearBufferEntry();
    isBlockMode = false;
    hasDecimal = false;
    doneEqual = true;
}

function calculate() {

    if (bufferEntry.length < 3) {
        return entryStr;
    }

    var total = Number(bufferEntry[0]);
    for (var i = 1; i < bufferEntry.length - 1; i += 2) {
        let operator = bufferEntry[i];
        let operand = Number(bufferEntry[i + 1]);
        switch (operator) {
            case "+":
                total += operand;
                break;
            case "-":
                total -= operand;
                break;
            case "*":
                total *= operand;
                break;
            case "/":
                if (operand == 0) {
                    setDivideByZeroLockup();
                    return;
                }
                console.log("total: ", total, " operand: ", operand);
                total /= operand;
                console.log("new total: ", total);
                break;
        }
    }
    total = Math.round(total * 100000000000) / 100000000000; // round beautifully
    document.getElementById("resultText").innerHTML = getString(total);
    return getString(total);
}

function displayBufferEntry() {
    let tmpStr = "";

    bufferEntry.forEach(item => {
        tmpStr += item + " ";
    });

    let length = tmpStr.length;
    if (length > 40) {
        tmpStr = "&#8810;" + tmpStr.substring(length - 39, length - 1);
    }
    document.getElementById("progressText").innerHTML = tmpStr;
}

function clearBufferEntry() {
    bufferEntry = [];
    document.getElementById("progressText").innerHTML = "&nbsp;";
}

function resetEntry() {
    entryStr = "0";
    hasDecimal = false;
    document.getElementById("resultText").innerHTML = entryStr;
}

function resetEverything() {
    resetEntry();
    clearBufferEntry();
    isBlockMode = false;
    isDivByZeroLockup = false;
    doneEqual = false;
}

function clearEntryClicked(evt) {
    if (isDivByZeroLockup) {
        resetEverything();
    } else {
        resetEntry();
    }
}

function allClearClicked(evt) {
    resetEverything();
}

function setDivideByZeroLockup() {
    document.getElementById("resultText").innerHTML = "cannot divide by zero";
    isDivByZeroLockup = true;
}

function playDingSound() {
    dingSound.currentTime = 0; // stop old playing sound
    dingSound.play();
}

function getString(num) {
    return "" + num;
}

function isTooLong(str) {
    let tmpStr = str.replace(".", "");
    if (tmpStr.length == 16) {
        return true;
    }
    return false;
}