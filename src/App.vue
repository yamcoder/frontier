<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Board } from "./omega";

const canvasContainerRef = ref<HTMLElement>();
const board = new Board();

const state = ref({
  viewportCorner: board.state.viewportX,
  scale: board.state.scale,
  offset: board.state.offsetX,
  pointer: board.state.pointerX,
  elements: board.layer.elementsViewList,
  hoverElementId: board.state.hoverElementId,
  selectedElement: board.state.selectedElementId,
});

onMounted(() => {
  board.mount(canvasContainerRef.value!);
  board.stateChange$.subscribe(() => {
    state.value.viewportCorner = board.state.viewportX;
    state.value.scale = board.state.scale;
    state.value.offset = board.state.offsetX;
    state.value.pointer = board.state.pointerX;
    state.value.elements = board.layer.elementsViewList;
    state.value.hoverElementId = board.state.hoverElementId;
    state.value.selectedElement = board.state.selectedElementId;
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
        Viewport Offset: {{ state.offset.toString() }} <br />
        Pointer: {{ state.pointer.toString() }} <br />
        Scale: {{ state.scale }} <br />
        hoverElementId: {{ state.hoverElementId }} <br />
        selectedElement: {{ JSON.stringify(state.selectedElement) }} <br />
        <ul>
          <li v-for="element in state.elements">
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
  font-size: 1rem;
}
</style>
