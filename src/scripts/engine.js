const audioPlayer = document.getElementById("audio-player");

audioPlayer.addEventListener("click", () => {
  var bgm = document.getElementById("bgm");
  state.audio.backgroundAudio = !state.audio.backgroundAudio;

  if (state.audio.backgroundAudio) {
    audioPlayer.classList.add("active");
    audioPlayer.classList.remove("inactive");

    bgm.play();
  } else {
    audioPlayer.classList.add("inactive");
    audioPlayer.classList.remove("active");

    bgm.pause();
  }
});

const state = {
  audio: {
    backgroundAudio: false,
  },
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  playerSides: {
    player1: "player-cards",
    player1Box: document.querySelector("#player-cards"),
    player2: "computer-cards",
    player2Box: document.querySelector("#computer-cards"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon2.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician2.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia2.png`,
    winOf: [0],
    loseOf: [1],
  },
];

function init() {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.player2);
}

async function drawCards(cardsNumber, fieldSide) {
  for (let i = 0; i < cardsNumber; i++) {
    const randomCard = await getRandomCard();
    const cardImage = await createCardImage(randomCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function createCardImage(card, fieldSide) {
  const cardImage = document.createElement("img");

  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", card.id);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener("click", async () => {
      await setCardsField(cardImage.getAttribute("data-id"));
    });

    cardImage.addEventListener("mouseover", async () => {
      await drawSelectedCard(card.id);
    });
  }

  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCardsImages();
  const computerCard = await getRandomCard();
  const playerCard = cardData[cardId];

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.fieldCards.player.src = playerCard.img;
  state.fieldCards.computer.src = computerCard.img;

  const duelResult = await checkDuelResult(playerCard, computerCard);

  await updateScore();
  await drawButton(duelResult);
}

async function resetDuel() {
  state.cardSprites.name.innerText = "Selecione";
  state.cardSprites.type.innerText = "uma carta";
  state.cardSprites.avatar.src = "";

  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  init();
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(result) {
  state.actions.button.innerText = result.toUpperCase();
  state.actions.button.style.display = "block";
}

async function checkDuelResult(playerCard, computerCard) {
  let duelResult = "draw";

  if (playerCard.winOf.includes(computerCard.id)) {
    duelResult = "win";
    state.score.playerScore++;
  }

  if (playerCard.loseOf.includes(computerCard.id)) {
    duelResult = "lose";
    state.score.computerScore++;
  }

  await playAudio(duelResult);
  return duelResult;
}

async function removeAllCardsImages() {
  let { player1Box, player2Box } = state.playerSides;

  let imgElements = player1Box.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  imgElements = player2Box.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function drawSelectedCard(cardId) {
  const selectedCard = cardData[cardId];

  state.cardSprites.avatar.src = selectedCard.img;
  state.cardSprites.name.innerText = selectedCard.name;
  state.cardSprites.type.innerText = `Attribute: ${selectedCard.type}`;
}

async function getRandomCard() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex];
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}

init();
