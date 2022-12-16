import type { Board } from "./board";

const COLOR_BORDER = '#0d99ff';
const COLOR_BORDER_HOVER = '#007be5';

export class Layer {
  #_board: Board;
  #_ctx: CanvasRenderingContext2D;

  elements: any[] = [];

  constructor(ctx: CanvasRenderingContext2D, board: Board) {
    this.#_ctx = ctx;
    this.#_board = board;
    this.elements.push(new Rect(1200, 1200, 200, 200, 'tomato'));
    this.elements.push(new Circle(1540, 1750, 100, 'gold'));
  }

  draw() {
    this.elements.forEach(obj => {
      obj.draw(this.#_ctx, this.#_board);
    });
  }
}

interface Shape {
  hover: boolean;
  topHover: boolean;
  checkHover(pointer: [number, number]): boolean;
  draw(ctx: CanvasRenderingContext2D, board: Board): void;
}

class Rect implements Shape {
  hover = false;
  topHover = false;

  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;

  constructor(x: number, y: number, w: number, h: number, fillColor: string) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.fillColor = fillColor;
  }

  checkHover(pointer: [number, number]): boolean {
    const result = (pointer[0] >= this.x && pointer[0] <= this.x + this.width) &&
      (pointer[1] >= this.y && pointer[1] <= this.y + this.height);
    this.hover = result;
    return result;
  }

  draw(ctx: CanvasRenderingContext2D, board: Board) {
    ctx.beginPath();
    ctx.fillStyle = this.fillColor;
    ctx.fillRect((this.x - board.viewportCorner[0]) * board.scale, (this.y - board.viewportCorner[1]) * board.scale, this.width * board.scale, this.height * board.scale);
    ctx.closePath();
  }
}

class Circle implements Shape {
  hover = false;
  topHover = false;

  x: number;
  y: number;
  radius: number;
  fillColor: string;

  constructor(x: number, y: number, r: number, fillColor: string) {
    this.x = x;
    this.y = y;
    this.radius = r;
    this.fillColor = fillColor;
  }

  checkHover(pointer: [number, number]): boolean {
    const result = Math.sqrt((pointer[0] - this.x) ** 2 + (pointer[1] - this.y) ** 2) <= this.radius;
    this.hover = result;
    return result;
  }

  draw(ctx: CanvasRenderingContext2D, board: Board) {
    ctx.beginPath();
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 10;
    ctx.arc((this.x - board.viewportCorner[0]) * board.scale, (this.y - board.viewportCorner[1]) * board.scale, this.radius * board.scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
}
