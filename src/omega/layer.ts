import type { Board } from "./board";
import { Circle } from "./shapes/circle";
import { Rectangle } from "./shapes/rectangle";

export class Layer {
  #_board: Board;
  #_ctx: CanvasRenderingContext2D;

  elements: any[] = [];

  constructor(ctx: CanvasRenderingContext2D, board: Board) {
    this.#_ctx = ctx;
    this.#_board = board;
    this.elements.push(new Rectangle(1, 1200, 1200, 200, 200, 'tomato'));
    this.elements.push(new Circle(2, 1750, 1550, 100, 'orange'));
    this.elements.push(new Circle(3, 1350, 1350, 100, 'gold'));
  }

  draw(): void {
    this.elements.forEach(obj => {
      obj.draw(this.#_ctx, this.#_board);
    });
  }

  drawOutline(elementId: number): void {
    const foundElement = this.elements.find(el => el.id === elementId);
    foundElement?.drawOutline(this.#_ctx, this.#_board);
  }
}
