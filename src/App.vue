<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Board } from "./frontear";

const canvasContainerRef = ref<HTMLElement>();
const board = new Board();

const state = ref({
  shapes: board.shapes,
  scale: board.state.scale,
  viewportX: board.state.viewportX,
  viewportY: board.state.viewportY,
  offsetX: board.state.offsetX,
  offsetY: board.state.offsetY,
  pointerX: board.state.pointerX,
  pointerY: board.state.pointerY,
  hoverElementId: board.state.hoverElementId,
  selectedElement: board.state.selectedElementId,
});

onMounted(() => {
  board.mount(canvasContainerRef.value!);
  board.stateChanges$.subscribe(() => {
    state.value.shapes = board.shapes;
    state.value.scale = board.state.scale;
    state.value.viewportX = board.state.viewportX;
    state.value.viewportY = board.state.viewportY;
    state.value.offsetX = board.state.offsetX;
    state.value.offsetY = board.state.offsetY;
    state.value.pointerX = board.state.pointerX;
    state.value.pointerY = board.state.pointerY;
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
        Viewport Corner: [{{ state.viewportX }}, {{ state.viewportY }}] <br />
        Viewport Offset: [{{ state.offsetX }}, {{ state.offsetY }}] <br />
        Pointer: [{{ state.pointerX }}, {{ state.pointerY }}]<br />
        Scale: {{ state.scale }} <br />
        hoverElementId: {{ state.hoverElementId }} <br />
        selectedElement: {{ JSON.stringify(state.selectedElement) }} <br />
        <ul>
          <li v-for="shape in state.shapes">
            {{ JSON.stringify(shape) }}
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
