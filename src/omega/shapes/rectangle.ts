import { Shape } from "./shape";
import type { Board } from "../board";
import { COLOR_BRAND } from "../constants/colors";

export class Rectangle extends Shape {
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
    ctx.strokeStyle = COLOR_BRAND;
    ctx.lineWidth = 3;
    ctx.rect((this.x - board.viewportCorner[0]) * board.scale, (this.y - board.viewportCorner[1]) * board.scale, this.width * board.scale, this.height * board.scale);
    ctx.stroke();
    ctx.closePath();
  }
}
