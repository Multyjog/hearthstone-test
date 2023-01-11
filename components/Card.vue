<template>
  <div>
    <div class="card" @click="attack">
      <div>
        <img :src="cardData.img" :alt="cardData.name + 'image'" />
      </div>
      <div class="card-health">HP: {{ data.health }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";
import { cloneDeep } from "lodash";
import { Card } from "@/interfaces";

export default {
  name: "CardComponent",
  props: ["data", "attackAllowed"],
  emits: ["attack"],

  setup(props, { emit }) {
    const cardData: Ref<Card> = ref(cloneDeep(props.data));

    const attack = () => {
      if (!props.attackAllowed) return;
      emit("attack", cardData.value.attack);
    };
    return {
      cardData,
      attack,
    };
  },
};
</script>

<style scoped>
.card {
  cursor: pointer;
}
.card-health {
  text-align: center;
}
img {
  width: 230px;
}
.health-bar {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  height: 20px;
  padding: 5px;
  background: #ddd;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  position: relative;
}
.bar {
  background: #c54;
  width: 100%;
  height: 10px;
  position: relative;

  transition: width 0.5s linear;
}

.hit {
  background: rgba(255, 255, 255, 0.6);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 0px;

  transition: width 0.5s linear;
}
</style>
