import { Shape } from "./shape";
import type { Board } from "../board";
import { COLOR_BRAND } from "../constants/colors";

export class Circle extends Shape {
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
    ctx.strokeStyle = COLOR_BRAND;
    ctx.lineWidth = 3;
    ctx.arc((this.x - board.viewportCorner[0]) * board.scale, (this.y - board.viewportCorner[1]) * board.scale, this.radius * board.scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  }
}
