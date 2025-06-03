/*
Author: Marco Padilla
Date: 05/26/2024
Filename: app.js
Supporting Files: index.html
Date Modified: 05/26/2024
*/

import {buildDeck, drawCards} from './api.js'

const NUM_DECKS = 4;
const NUM_CARDS = 2;

const deck = await buildDeck(NUM_DECKS);

let dealerScore = 0;
let playerScore = 0;

let dealerAceCount = 0;
let playerAceCount = 0;

let hidden;

const canHit = true;

// const result = document.getElementById("result");


async function startGame(){
    const dealerHand = await drawCards(deck.deck_id, NUM_CARDS);
   
    hidden = dealerHand.cards[0];
    
    const dealerSecondCard = dealerHand.cards[1];
    displayCard(dealerSecondCard, "dealer-cards");
    dealerScore += getValue(dealerSecondCard.value);
    dealerAceCount += checkAce(dealerSecondCard.value);
    
    
    const playerHand = await drawCards(deck.deck_id, NUM_CARDS);
    
    for(let i = 0; i < playerHand.cards.length; i++){
        const card = displayCard(playerHand.cards[i], "player-cards");
        playerScore += getValue(card);
        playerAceCount += checkAce(card);


    }

    if(canHit){
        document.getElementById("hit").addEventListener("click", hit);
        document.getElementById("player-sum").innerHTML = playerScore;
    }
    

    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("dealer-sum").innerHTML = dealerScore;
}

startGame();

async function hit(){
    const drawCard = await drawCards(deck.deck_id, 1);
    const newCard = drawCard.cards[0];

    if(!canHit){

        return;
    }
    else{
        displayCard(newCard, "player-cards");
        playerScore += getValue(newCard.value);
        playerAceCount += checkAce(newCard.value);
        document.getElementById("player-sum").innerHTML = reduceAce(playerScore, playerAceCount);
    }

    if(reduceAce(playerScore, playerAceCount) > 21 || playerScore > 21) {
        canHit = false;
    }
}

async function stay(){
    document.getElementById("hidden-card").src = hidden.image;
    dealerScore += getValue(hidden.value);
    dealerAceCount += checkAce(hidden.value);
    document.getElementById("dealer-sum").innerHTML = dealerScore;
    
    while(dealerScore < 17){
        const drawCard = await drawCards(deck.deck_id, 1);
        const newCard = drawCard.cards[0];

        displayCard(newCard, "dealer-cards");
        dealerScore += getValue(newCard.value);
        dealerAceCount += checkAce(newCard.value);
        document.getElementById("dealer-sum").innerHTML = reduceAce(dealerScore, dealerAceCount);
    }

}



function displayCard (hand, cards){
    let cardImg = document.createElement("img");
    cardImg.src = hand.image;
    document.getElementById(cards).append(cardImg);
    
    return hand.value;
}


function getValue (card) {
    
    if(card === "KING" || card === "QUEEN" || card === "JACK"){
        return 10;
    }
    else if(card === "ACE"){
        return 11;
    } 
    else {
        return parseInt(card);
    }

};

function checkAce (card) {
    
    if(card === "ACE"){
        return 1;
    } 
    else {
        return 0;
    }

};


function finalScore(pScore, dScore){
    if(pScore > dScore){
        console.log(`Player wins with ${pScore} over ${dScore}`);
    }
    else if (pScore < dScore){
        console.log(`Dealer wins with ${dScore} over ${pScore}`);
    }
    else{
        console.log("Game end in a tie");
    }
}

function reduceAce (playerScore, playerAceCount){
    while(playerScore > 21 && playerAceCount > 0){
        playerScore -= 10;
        playerAceCount -= 1;
    }
    return playerScore;

}