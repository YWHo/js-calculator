'use strict';

document.addEventListener('DOMContentLoaded', startCalculator);

var fullEntry = [];
var entryStr = "0";
var hasDecimal = false;
var blockMode = false;
var dingSound;

function startCalculator() {
    document.getElementById("button0").addEventListener("click", numButtonClicked);

    Array.from(document.getElementsByClassName("numButtons")).forEach(button => button.addEventListener("click", numButtonClicked));
    document.getElementById("buttonDel").addEventListener("click", delButtonClicked);
    document.getElementById("buttonDot").addEventListener("click", dotButtonClicked);
    document.getElementById("buttonCE").addEventListener("click", clearEntryClicked);
    document.getElementById("buttonAdd").addEventListener("click", addButtonClicked);
    
    // initialize sound element
    dingSound = document.getElementById("dingSound");

}

function numButtonClicked(evt) {
    console.log(evt.target.innerText);

    if (isTooLong(entryStr)) {
        playDingSound();
        return;
    } 

    if (entryStr === "0") {
        entryStr = getString(evt.target.innerText);
    } else {
        entryStr += evt.target.innerText;
    }

    document.getElementById("resultText").innerHTML = entryStr;
    blockMode = false;
    console.log(entryStr);
}

function delButtonClicked(evt) {
    console.log(evt.target.innerText);

    if (blockMode) {
        playDingSound();
        return;
    }

    if (entryStr[entryStr.length-1] === ".") {
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
    console.log("dot clicked");
    if (hasDecimal) {
        playDingSound();
        return;
    }
    hasDecimal = true;
    entryStr += ".";
    document.getElementById("resultText").innerHTML = entryStr;
}

function addButtonClicked(evt) {

    if (blockMode) {
        fullEntry.pop();
        fullEntry.push("+");
        return;
    }

    fullEntry.push(entryStr);
    fullEntry.push("+");
    
    displayFullEntry();
    entryStr = "0";
    blockMode = true;
}

function displayFullEntry() {
    let tmpStr = "";

    fullEntry.forEach(item => {
        tmpStr += item + " ";
    });

    let length = tmpStr.length;
    if (length > 40) {
        tmpStr = "&#8810;" + tmpStr.substring(length-39, length-1);
    }
    document.getElementById("progressText").innerHTML = tmpStr;
}

function resetEntry() {
    entryStr = "0";
    hasDecimal = false;
    document.getElementById("resultText").innerHTML = entryStr;
}

function clearEntryClicked(evt) {
    console.log("ce clicked");
    resetEntry();
}

function playDingSound() {
    dingSound.currentTime = 0;  // stop old playing sound
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