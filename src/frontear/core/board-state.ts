export class BoardState {
  scale = 1;
  viewportX: number = 1000;
  viewportY: number = 1000;
  pointerX: number = 0;
  pointerY: number = 0;
  offsetX: number = 0;
  offsetY: number = 0;
  hoveredShapeId: number = 0;
  selectedShapeId: number = 0;
}
