'use strict';

document.addEventListener('DOMContentLoaded', startCalculator);

var fullEntry = [];
var entryStr = "0";
var hasDecimal = false;
var isBlockMode = false;
var doneEqual = false;
var dingSound;

function startCalculator() {
    document.getElementById("button0").addEventListener("click", numButtonClicked);

    Array.from(document.getElementsByClassName("numButtons")).forEach(button => button.addEventListener("click", numButtonClicked));
    document.getElementById("buttonDel").addEventListener("click", delButtonClicked);
    document.getElementById("buttonDot").addEventListener("click", dotButtonClicked);
    document.getElementById("buttonCE").addEventListener("click", clearEntryClicked);
    document.getElementById("buttonAdd").addEventListener("click", addButtonClicked);
    document.getElementById("buttonSub").addEventListener("click", subButtonClicked);
    document.getElementById("buttonEql").addEventListener("click", equalButtonClicked);

    // initialize sound element
    dingSound = document.getElementById("dingSound");

}

function numButtonClicked(evt) {
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

function doOperation(opr) {
    if (isBlockMode) {
        fullEntry.pop();
        fullEntry.push(opr);
    } else {
        fullEntry.push(entryStr);
        fullEntry.push(opr);
        calculate();
        entryStr = "0";
    }

    displayFullEntry();
    isBlockMode = true;
    hasDecimal = false;
}

function equalButtonClicked(evt) {
    fullEntry.push(entryStr);
    entryStr = calculate();
    clearFullEntry();
    isBlockMode = false;
    hasDecimal = false;
    doneEqual = true;
}

function calculate() {

    if (fullEntry.length < 3) {
        return entryStr;
    }

    var total = Number(fullEntry[0]);
    for(var i=1; i<fullEntry.length-1; i+=2) {
        if (fullEntry[i] === "+") {
            total += Number(fullEntry[i+1]);
        } else if (fullEntry[i] === "-") {
            total -= Number(fullEntry[i+1]);
        }
    }
    document.getElementById("resultText").innerHTML = getString(total);
    return getString(total);
}

function displayFullEntry() {
    let tmpStr = "";

    fullEntry.forEach(item => {
        tmpStr += item + " ";
    });

    let length = tmpStr.length;
    if (length > 40) {
        tmpStr = "&#8810;" + tmpStr.substring(length - 39, length - 1);
    }
    document.getElementById("progressText").innerHTML = tmpStr;
}

function clearFullEntry() {
    fullEntry = [];
    document.getElementById("progressText").innerHTML = "&nbsp;";
}

function resetEntry() {
    entryStr = "0";
    hasDecimal = false;
    document.getElementById("resultText").innerHTML = entryStr;
}

function clearEntryClicked(evt) {
    resetEntry();
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