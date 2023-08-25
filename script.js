var countDownDate = new Date();
console.log(countDownDate);

// Update the count down every 1 second
var x = setInterval(function () {
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("demo").innerHTML =
    days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "EXPIRED";
  }
}, 1000);

const cardsContainer = document.getElementById("cards");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
document.getElementById("score").textContent = score;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
    console.log(cards);
  });

function shuffleCards() {
  let randomIndex;
  let currentIndex = cards.length;
  let temp;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    temp = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temp;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardEelement = document.createElement("div");
    cardEelement.classList.add("card");
    cardEelement.setAttribute("data-name", card.name);
    cardEelement.innerHTML = `
        <div class ="front">
          <img  class = "front-image "src="${card.image}"/>

        </div>
       <div class ="back"></div>
       `;
    cardsContainer.appendChild(cardEelement);
    cardEelement.addEventListener("click", flipCard);
    cardEelement.addEventListener("touchstart", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");
  if (!firstCard) {
    firstCard = this;
    return;
  }
  secondCard = this;
  lockBoard = true;
  checkForMatch();
  document.getElementById("score").textContent = score;
}
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  if (isMatch) {
    disableCard();
  } else {
    unflipCard();
  }
}
function disableCard() {
  firstCard.removeEventListener("click", flipCard);
  firstCard.removeEventListener("touchstart", flipCard);
  secondCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("touchstartk", flipCard);
  score++;
  if (score === 9) startConfetti();
  unlockBoard();
}
function unlockBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}
function unflipCard() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    unlockBoard();
  }, 600);
}
function restart() {
  shuffleCards();
  unlockBoard();
  score = 0;
  cardsContainer.innerHTML = "";
  generateCards();
  document.getElementById("score").textContent = score;
  stopConfetti();
}
