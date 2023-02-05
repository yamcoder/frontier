<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Board } from "./frontear";

const canvasContainerRef = ref<HTMLElement>();
const board = new Board();

const boardContext = ref({
  shapes: board.shapes,
  state: board.state,
});

onMounted(() => {
  board.mount(canvasContainerRef.value!);
  board.stateChanges$.subscribe(() => {
    boardContext.value.shapes = board.shapes;
    boardContext.value.state = board.state;
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
        Viewport Corner: [{{ boardContext.state.viewportX }}, {{ boardContext.state.viewportY }}] <br />
        Viewport Offset: [{{ boardContext.state.offsetX }}, {{ boardContext.state.offsetY }}] <br />
        Pointer: [{{ boardContext.state.pointerX }}, {{ boardContext.state.pointerY }}]<br />
        Scale: {{ boardContext.state.scale }} <br />
        hoveredShapeId: {{ boardContext.state.hoveredShapeId }} <br />
        selectedShapeId: {{ JSON.stringify(boardContext.state.selectedShapeId) }} <br />
        <ul>
          <li v-for="shape in boardContext.shapes">
            {{ JSON.stringify(shape, null, 2) }}
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
