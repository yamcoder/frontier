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
  checkHover(): boolean;
  checkHoverLT(): boolean;
  checkHoverRT(): boolean;
  checkHoverLB(): boolean;
  checkHoverRB(): boolean;
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
  isHoverLT: boolean = false;
  isHoverRT: boolean = false;
  isHoverLB: boolean = false;
  isHoverRB: boolean = false;
  isSelected: boolean = false;
  abstract checkHover(): boolean;
  abstract checkHoverLT(): boolean;
  abstract checkHoverRT(): boolean;
  abstract checkHoverLB(): boolean;
  abstract checkHoverRB(): boolean;
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

  abstract get areaWidth(): number;
  abstract get areaHeight(): number;

  get viewX() { return this.context.boardState.offsetX; }
  get viewY() { return this.context.boardState.offsetY; }

  get viewLeftX() { return (this.x - this.context.boardState.viewportX) * this.context.boardState.scale; }
  get viewTopY() { return (this.y - this.context.boardState.viewportY) * this.context.boardState.scale; }

  get viewWidth() { return this.areaWidth * this.boardState.scale; }
  get viewHeight() { return this.areaHeight * this.boardState.scale; }

  get viewRightX() { return (this.x - this.boardState.viewportX + this.areaWidth) * this.boardState.scale; }
  get viewBottomY() { return (this.y - this.boardState.viewportY + this.areaHeight) * this.boardState.scale; }

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
