<script setup lang="ts">
import { onMounted, ref } from "vue";
import SelectButton, { type SelectButtonChangeEvent } from 'primevue/selectbutton';

import { Board } from "./frontier";

const canvasContainerRef = ref<HTMLElement>();
const board = new Board();
const createdNodeType = ref(board.scene.beingCreatedNodeType);
const createdNodeOptions = ref([
  { type: 'RECTANGLE', label: 'Прямоугольник' },
  { type: 'ELLIPSE', label: 'Эллипс' },
]);
const createNode = (event: SelectButtonChangeEvent) => {
  board.createNode(event.value);
};

const sceneContext = ref({
  nodes: board.nodes,
  scene: board.scene,
});

onMounted(() => {
  board.mount(canvasContainerRef.value!);
  board.context.stateChanges$.subscribe(() => {
    sceneContext.value.nodes = board.nodes;
    sceneContext.value.scene = board.scene;
    createdNodeType.value = board.scene.beingCreatedNodeType;
  });
});
</script>

<template>
  <div class="container">
    <header class="header">
      <span class="header__title"></span>
      <div class="header__actions">
        <SelectButton
          v-model="createdNodeType"
          :options="createdNodeOptions"
          optionLabel="label"
          optionValue="type"
          aria-labelledby="single"
          @change="createNode"
        />
      </div>
    </header>
    <main ref="canvasContainerRef"></main>
    <aside>
      <div class="aside">
        Viewport: [{{ sceneContext.scene.viewportX }}, {{ sceneContext.scene.viewportY }}] <br />
        Pointer: [{{ sceneContext.scene.pointerX }}, {{ sceneContext.scene.pointerY }}]<br />
        Offset: [{{ sceneContext.scene.offsetX }}, {{ sceneContext.scene.offsetY }}] <br />
        Scale: {{ sceneContext.scene.scale }} <br />
        hoveredNodeId: {{ sceneContext.scene.hoveredNodeId }} <br />
        selectedNodeId: {{ sceneContext.scene.selectedNodeId }} <br />
        beingCreatedNode: {{ sceneContext.scene.beingCreatedNodeType }} <br />
        isCreating: {{ sceneContext.scene.isCreating }} <br />
        isDragging: {{ sceneContext.scene.isDragging }} <br />
        isResizing: {{ sceneContext.scene.isResizing }} <br />
        isHoverSelectedNodeArea: {{ sceneContext.scene.isHoverSelectedNodeArea }} <br />
        isHoverResizeControls: {{ sceneContext.scene.isHoverResizeControls }} <br />
        isHoverResizeControl: <pre>{{ JSON.stringify(sceneContext.scene.isHoverResizeControl, null, 2) }}</pre> <br />
        <ul>
          <li v-for="node in sceneContext.nodes">
            {{ JSON.stringify(node, null, 2) }}
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

.header__actions {
  flex: 1;
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
