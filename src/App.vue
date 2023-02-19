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
  board.context.stateChanges$.subscribe(() => {
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
        Viewport: [{{ boardContext.state.viewportX }}, {{ boardContext.state.viewportY }}] <br />
        Pointer: [{{ boardContext.state.pointerX }}, {{ boardContext.state.pointerY }}]<br />
        Offset: [{{ boardContext.state.offsetX }}, {{ boardContext.state.offsetY }}] <br />
        Scale: {{ boardContext.state.scale }} <br />
        beingCreatedNode: {{ boardContext.state.beingCreatedNode }} <br />
        isCreating: {{ boardContext.state.isCreating }} <br />
        hoveredShapeId: {{ boardContext.state.hoveredShapeId }} <br />
        selectedShapeId: {{ boardContext.state.selectedShapeId }} <br />
        isDragging: {{ boardContext.state.isDragging }} <br />
        isSizing: {{ boardContext.state.isSizing }} <br />
        isHoverShapeControlArea: {{ boardContext.state.isHoverShapeControlArea }} <br />
        isHoverShapeControlBoundary: {{ boardContext.state.isHoverShapeControlBoundary }} <br />
        isHoverShapeControlLT: {{ boardContext.state.isHoverShapeControlLT }} <br />
        isHoverShapeControlRT: {{ boardContext.state.isHoverShapeControlRT }} <br />
        isHoverShapeControlLB: {{ boardContext.state.isHoverShapeControlLB }} <br />
        isHoverShapeControlRB: {{ boardContext.state.isHoverShapeControlRB }} <br />
        isHoverShapeControlT: {{ boardContext.state.isHoverShapeControlT }} <br />
        isHoverShapeControlR: {{ boardContext.state.isHoverShapeControlR }} <br />
        isHoverShapeControlB: {{ boardContext.state.isHoverShapeControlB }} <br />
        isHoverShapeControlL: {{ boardContext.state.isHoverShapeControlL }} <br />
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

  overflow: scroll;
}

.aside {
  font-size: 1rem;
}
</style>
