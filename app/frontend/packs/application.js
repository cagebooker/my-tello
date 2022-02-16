require("@rails/ujs").start();
require("turbolinks").start();
require("@rails/activestorage").start();
require("channels");

import "./styles";
// import Vue from "vue";
import { Vue } from "vue/dist/vue.esm";
import Rails from "@rails/ujs";
import draggable from "vuedraggable";
import store from "stores/list";
import { mapGetters, mapActions } from "vuex";
import List from "components/list";

document.addEventListener("DOMContentLoaded", function (event) {
  let el = document.querySelector("#board");

  if (el) {
    // console.log("hello");
    new Vue({
      el,
      store,
      computed: {
        ...mapGetters(["lists"]),
      },
      components: {
        List,
        draggable,
      },
      methods: {
        ...mapActions(["loadList", "moveList"]),
      },
      beforeMount() {
        this.loadList();
      },
    });
  }
});
