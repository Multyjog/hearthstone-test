<template>
  <div class="app">
    <!-- <NuxtWelcome /> -->
    <div v-if="game.state === 'win'" class="win-screen">
      <div>You won!</div>
      <button @click="gameStart" :disabled="game.state === 'loading'">
        <div v-if="game.state === 'loading'">LOADING...</div>
        <div v-else>START NEW ONE</div>
      </button>
    </div>
    <div class="button-wrapper">
      <button
        @click="gameStart"
        :disabled="game.state === 'loading'"
        v-if="game.state === 'idle' || game.state === 'loading'"
      >
        <div v-if="game.state === 'loading'">LOADING...</div>
        <div v-else>START</div>
      </button>
    </div>
    <div class="enemy-cards" v-if="enemyCard && game.state === 'in_progress'">
      <div class="enemy-cards-title">ENEMY:</div>
      <div class="enemy-cards-hand">
        <Card :data="enemyCard" />
      </div>
    </div>
    <div class="my-cards" v-if="playersHand && game.state === 'in_progress'">
      <div class="my-cards-title">MY CARDS:</div>
      <div class="my-cards-hand">
        <div v-for="(card, index) in playersHand" :key="index">
          <Card @attack="initiateAttack" :attackAllowed="true" :data="card" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { ref } from "vue";
import type { Ref } from "vue";
import { Card } from "@/interfaces";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { flatten } from "lodash";

export default {
  name: "App",
  setup() {
    const game: Ref = ref({ state: "idle" });
    const requestPlayerCards = {
      method: "GET",
      url: "https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/sets/Naxxramas",
      headers: {
        "X-RapidAPI-Key": "fdcf50f01bmsh8bf676ae14bbfc6p1135cejsn3071a4402710",
        "X-RapidAPI-Host": "omgvamp-hearthstone-v1.p.rapidapi.com",
      },
    };
    const requestEnemyCards = {
      method: "GET",
      url: "https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/sets/Naxxramas",
      params: { health: "30" },
      headers: {
        "X-RapidAPI-Key": "fdcf50f01bmsh8bf676ae14bbfc6p1135cejsn3071a4402710",
        "X-RapidAPI-Host": "omgvamp-hearthstone-v1.p.rapidapi.com",
      },
    };

    const enemyCard: Ref<Card | null> = ref(null);
    const playersHand: Ref<Array<Card>> = ref([]);
    const minionsCards: Ref<Array<Card>> = ref([]);

    const getPlayerCards = async () => {
      try {
        let res = await axios.request(requestPlayerCards);
        minionsCards.value = res.data.filter(
          (card: Card) => card.type === "Minion"
        );
        console.log("MINI CARDS:", minionsCards.value);
      } catch (err) {
        console.log(err);
      }
    };

    const getEnemyCard = async () => {
      try {
        let res = await axios.request(requestEnemyCards);
        const allCards = flatten(Object.values(res.data));
        var randomCard = allCards[Math.floor(Math.random() * allCards.length)];
        enemyCard.value = randomCard;
        console.log("ENEMY CARDS:", enemyCard.value);
      } catch (err) {
        console.log(err);
      }
    };

    // Get random cards and fill player hand
    const getRandomCards = (quantity: number) => {
      const shuffled = [...minionsCards.value].sort(() => 0.5 - Math.random());
      console.log("SHUFFLED:", shuffled);
      playersHand.value = [...shuffled.slice(0, quantity)];
      console.log("ASSEMBLED PLAYERS HAND:", playersHand.value);
    };

    const gameStart = async () => {
      game.value.state = "loading";
      await getPlayerCards();
      await getEnemyCard();
      game.value.state = "in_progress";
      getRandomCards(3);
    };
    const initiateAttack = (event: number) => {
      console.log(event);
      if (enemyCard.value && enemyCard.value.health > 0)
        enemyCard.value.health -= event;
      if (enemyCard.value && enemyCard.value.health <= 0) {
        console.log(enemyCard.value.health);
        game.value.state = "win";
      }
    };

    return {
      initiateAttack,
      enemyCard,
      playersHand,
      gameStart,
      game,
    };
  },
};
</script>

<style scoped>
button {
  border-radius: 20px;
  color: #2b1a1ad6;
  font-size: 30px;
  font-weight: bold;
  background-color: #c42222;
  padding: 15px 100px;
  letter-spacing: 0px;
  cursor: pointer;
}
button:hover {
  background-color: brown;
}
.button-wrapper {
  display: flex;
  justify-content: center;
}
.enemy-cards-hand {
  display: flex;
  justify-content: center;
}
.my-cards-hand {
  display: flex;
  justify-content: space-around;
}
.my-cards-title,
.enemy-cards-title {
  margin: 4rem 0 0;
  text-align: center;
  font-weight: bold;
}
.win-screen {
  text-align: center;
  font-size: 34px;
  font-weight: bold;
}
</style>
