import type { Board } from "../board";

export abstract class Shape {
  board: Board;
  id: number;
  x: number;
  y: number;
  isHover: boolean = false;
  isSelected: boolean = false;
  abstract checkHover(pointer: [number, number]): boolean;
  abstract draw(ctx: CanvasRenderingContext2D, board: Board): void;
  abstract drawHover(ctx: CanvasRenderingContext2D, board: Board): void;
  abstract drawSelected(ctx: CanvasRenderingContext2D, board: Board): void;
  setIsSelected(value: boolean): void {
    this.isSelected = value;
  };
  setXY([x, y]: [number, number]): void {
    this.x = x;
    this.y = y;
  };

  constructor(board: Board, id: number, x: number, y: number) {
    this.board = board;
    this.id = id;
    this.x = x;
    this.y = y;
  }
}
