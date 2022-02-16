<template>
  <div class="bg-gray-300 mx-2 w-64 rounded px-3 py-3 flex-none h-full">
    <h2 class="font-bold">{{ list.name }}</h2>
    <div class="deck">
      <draggable
        v-model="cards"
        ghost-class="ghost"
        group="list"
        @change="cardMoved"
      >
        <Card v-for="card in cards" :card="card" :key="card.id"></Card>
      </draggable>

      <div class="input-area">
        <button
          v-if="!editing"
          class="px-3 py-1 font-semibold text-sm bg-gray-400 focus:outline-none rounded"
          @click="editing = true"
        >
          新增卡片
        </button>
        <textarea
          v-if="editing"
          name
          id
          cols="30"
          rows="4"
          class="content"
          v-model="content"
        ></textarea>
        <button
          v-if="editing"
          class="px-3 py-1 font-semibold text-sm bg-green-300 focus:outline-none rounded"
          @click="createCard"
        >
          建立卡片
        </button>
        <button
          v-if="editing"
          class="px-3 py-1 font-semibold text-sm bg-gray-400 focus:outline-none rounded"
          @click="editing = false"
        >
          取消
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Rails from "@rails/ujs";
import Card from "components/card";
import draggable from "vuedraggable";
export default {
  name: "List",
  props: ["list"],
  components: { Card, draggable },
  data: function () {
    return {
      content: "",
      cards: this.list.cards,
      editing: false,
    };
  },
  methods: {
    cardMoved(event) {
      // console.log(event);
      console.log(this.list);
      // console.log(this.list.id);
      let evt = event.added || event.moved;
      if (evt) {
        let el = evt.element;
        let card_id = el.id;

        let data = new FormData();
        data.append("card[list_id]", this.list.id);
        data.append("card[position]", evt.newIndex + 1);

        Rails.ajax({
          url: `/cards/${card_id}/move`,
          type: "PUT",
          data,
          dataType: "json",
          success: (res) => {
            console.log(res);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    },
    createCard(event) {
      event.preventDefault();
      // console.log(this.content);
      let data = new FormData();
      data.append("card[list_id]", this.list.id);
      data.append("card[name]", this.content);

      Rails.ajax({
        url: "/cards",
        type: "POST",
        data,
        dataType: "json",
        success: (res) => {
          console.log(res);
          this.cards.push(res);
          this.content = "";
          this.editing = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.ghost {
  border: 2px;
  border-color: #d8dbe4;
  border-style: dashed;
  background-color: #eef0fa;
}
.input-area {
  margin-top: 10px;
  .content {
    width: 100%;
    padding: 4px 8px 4px 8px;
    // padding-left: 8px;
    border-radius: 2px;
    &:focus {
      outline: none;
    }
  }
}
</style>
