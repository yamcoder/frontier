import type { Board } from "../board";
import type { BoardState } from './../boardState';

export interface Shape {
  context: {
    boardState: BoardState;
    ctx2d: CanvasRenderingContext2D;
  };
  id: number;
  x: number;
  y: number;
  fillColor: string;
  isHover: boolean;
  isSelected: boolean;
  checkHover(pointer: [number, number]): boolean;
  draw(): void;
  drawHover(): void;
  drawSelected(): void;
  setIsSelected(value: boolean): void;
  setXY([x, y]: [number, number]): void;
}

export abstract class AbstractShape implements Shape {
  context: {
    boardState: BoardState;
    ctx2d: CanvasRenderingContext2D;
  };
  id: number;
  x: number;
  y: number;
  fillColor: string;
  isHover: boolean = false;
  isSelected: boolean = false;
  abstract checkHover(pointer: [number, number]): boolean;
  abstract draw(): void;
  abstract drawHover(): void;
  abstract drawSelected(): void;
  setIsSelected(value: boolean): void {
    this.isSelected = value;
  };
  setXY([x, y]: [number, number]): void {
    this.x = x;
    this.y = y;
  };

  get boardState() { return this.context.boardState };
  get ctx2d() { return this.context.ctx2d };

  abstract get _width(): number;
  abstract get _height(): number;

  get viewLeftX() { return (this.x - this.context.boardState.viewportCorner[0]) * this.context.boardState.scale; }
  get viewTopY() { return (this.y - this.context.boardState.viewportCorner[1]) * this.context.boardState.scale; }

  get viewWidth() { return this._width * this.boardState.scale; }
  get viewHeight() { return this._height * this.boardState.scale; }

  get viewRightX() { return (this.x - this.boardState.viewportCorner[0] + this._width) * this.boardState.scale; }
  get viewBottomY() { return (this.y - this.boardState.viewportCorner[1] + this._height) * this.boardState.scale; }

  constructor(boardState: BoardState, ctx2d: CanvasRenderingContext2D, id: number, x: number, y: number, fillColor: string) {
    this.context = {
      boardState,
      ctx2d
    };
    this.id = id;
    this.x = x;
    this.y = y;
    this.fillColor = fillColor;
  }
}
