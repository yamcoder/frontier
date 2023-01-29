import { Board } from "./board";
import { Circle } from "./shapes/circle";
import { Rectangle } from "./shapes/rectangle";

export class Layer extends Board {
  // #_board: Board;
  // #_ctx: CanvasRenderingContext2D;

  elements: any[] = [];

  constructor() {
    super();

    this.elements.push(new Rectangle(board, 1, 1200, 1200, 200, 200, 'tomato'));
    this.elements.push(new Circle(board, 2, 1750, 1550, 100, 'orange'));
    this.elements.push(new Circle(board, 3, 1350, 1350, 100, '#52BE80'));
  }

  draw(): void {
    this.elements.forEach(obj => {
      obj.draw(this.ctx, this);
    });
  }

  drawHover(elementId: number): void {
    const foundElement = this.elements.find(el => el.id === elementId);
    foundElement?.drawHover(this.#_ctx, this.#_board);
  }

  drawSelected(element: any): void {
    if (element && element.isSelected) {
      element.drawSelected(this.#_ctx, this.#_board);
    }
  }
}
