export class BoardState {
  scale = 1;
  viewportCorner: [number, number] = [1000, 1000];
  pointer: [number, number] = [0, 0];
  offset: [number, number] = [0, 0];
  hoverElementId: number = 0;
  selectedElementId: number = 0;

  constructor() {

  }
}
