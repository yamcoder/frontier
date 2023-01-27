<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Board } from "./omega";

const canvasContainerRef = ref<HTMLElement>();
const board = new Board();

const state = ref({
  viewportCorner: board.viewportCorner,
  scale: board.scale,
  offset: board.offset,
  pointer: board.pointer,
  elements: board.layer.elements,
  hoverElementId: board.hoverElementId,
  selectedElement: board.selectedElement,
});

onMounted(() => {
  board.mount(canvasContainerRef.value!);
  board.stateChange$.subscribe(() => {
    state.value.viewportCorner = board.viewportCorner;
    state.value.scale = board.scale;
    state.value.offset = board.offset;
    state.value.pointer = board.pointer;
    state.value.elements = board.layer.elements;
    state.value.hoverElementId = board.hoverElementId;
    state.value.selectedElement = board.selectedElement;
  });
});
</script>

<template>
  <div class="container">
    <header class="header">
      <span class="header__title"></span>
    </header>
    <main ref="canvasContainerRef"></main>
    <aside>
      <div class="aside">
        Viewport Corner: {{ state.viewportCorner.toString() }} <br />
        <!-- Viewport Offset: {{ state.offset.toString() }} <br /> -->
        Pointer: {{ state.pointer.toString() }} <br />
        Scale: {{ state.scale }} <br />
        hoverElementId: {{ state.hoverElementId }} <br />
        selectedElement: {{ JSON.stringify(state.selectedElement) }} <br />
        <ul>
          <li v-for="element in state.elements.slice().reverse()">
            {{ JSON.stringify(element) }}
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 400px minmax(500px, 1fr);
  grid-template-rows: 60px minmax(500px, 1fr);
  grid-template-areas:
    "header header"
    "aside  main";

  height: 100vh;
}

.header {
  display: flex;
  align-items: center;
}

.header__title {
  flex: 1;

  text-align: center;
  font-size: 2rem;
}

header {
  grid-area: header;
  background-color: var(--blue-200);
}

main {
  grid-area: main;
  background-color: var(--surface-800);
}

aside {
  grid-area: aside;
}

.aside {
  font-size: 2rem;
}
</style>
