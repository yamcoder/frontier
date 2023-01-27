import type { Board } from "./board";

const COLOR_DeepSkyBlue = '#00BFFF';
const COLOR_LightSkyBlue = '#87CEFA';
const COLOR_BORDER = '#0d99ff';
const COLOR_BORDER_HOVER = '#007be5';

export class Layer {
  #_board: Board;
  #_ctx: CanvasRenderingContext2D;

  elements: any[] = [];

  constructor(ctx: CanvasRenderingContext2D, board: Board) {
    this.#_ctx = ctx;
    this.#_board = board;
    this.elements.push(new Rect(1, 1200, 1200, 200, 200, 'tomato'));
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

abstract class Shape {
  id: number;
  x: number;
  y: number;
  isHover: boolean = false;
  isSelected: boolean = false;
  abstract checkHover(pointer: [number, number]): boolean;
  abstract draw(ctx: CanvasRenderingContext2D, board: Board): void;
  abstract drawOutline(ctx: CanvasRenderingContext2D, board: Board): void;
  setIsSelected(value: boolean): void {
    this.isSelected = value;
  };
  setXY([x, y]: [number, number]): void {
    this.x = x;
    this.y = y;
  };

  constructor(id: number, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}

class Rect extends Shape {
  width: number;
  height: number;
  fillColor: string;

  constructor(id: number, x: number, y: number, w: number, h: number, fillColor: string) {
    super(id, x, y);

    this.width = w;
    this.height = h;
    this.fillColor = fillColor;
  }

  checkHover(pointer: [number, number]): boolean {
    const result = (pointer[0] >= this.x && pointer[0] <= this.x + this.width) &&
      (pointer[1] >= this.y && pointer[1] <= this.y + this.height);
    this.isHover = result;
    return result;
  }

  draw(ctx: CanvasRenderingContext2D, board: Board) {
    ctx.beginPath();
    ctx.fillStyle = this.fillColor;
    ctx.fillRect((this.x - board.viewportCorner[0]) * board.scale, (this.y - board.viewportCorner[1]) * board.scale, this.width * board.scale, this.height * board.scale);
    ctx.closePath();
  }

  drawOutline(ctx: CanvasRenderingContext2D, board: Board) {
    ctx.beginPath();
    ctx.strokeStyle = COLOR_BORDER;
    ctx.lineWidth = 3;
    ctx.rect((this.x - board.viewportCorner[0]) * board.scale, (this.y - board.viewportCorner[1]) * board.scale, this.width * board.scale, this.height * board.scale);
    ctx.stroke();
    ctx.closePath();
  }
}

class Circle extends Shape {
  radius: number;
  fillColor: string;

  constructor(id: number, x: number, y: number, r: number, fillColor: string) {
    super(id, x, y);

    this.radius = r;
    this.fillColor = fillColor;
  }

  checkHover(pointer: [number, number]): boolean {
    const result = Math.sqrt((pointer[0] - this.x) ** 2 + (pointer[1] - this.y) ** 2) <= this.radius;
    this.isHover = result;
    return result;
  }

  draw(ctx: CanvasRenderingContext2D, board: Board) {
    ctx.beginPath();
    ctx.fillStyle = this.fillColor;
    ctx.arc((this.x - board.viewportCorner[0]) * board.scale, (this.y - board.viewportCorner[1]) * board.scale, this.radius * board.scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  drawOutline(ctx: CanvasRenderingContext2D, board: Board) {
    ctx.beginPath();
    ctx.strokeStyle = COLOR_BORDER;
    ctx.lineWidth = 3;
    ctx.arc((this.x - board.viewportCorner[0]) * board.scale, (this.y - board.viewportCorner[1]) * board.scale, this.radius * board.scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  }
}
