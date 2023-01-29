import { Shape } from "./shape";
import type { Board } from "../board";
import { COLOR_BRAND } from "../constants/colors";

export class Circle extends Shape {
  radius: number;
  fillColor: string;

  constructor(board: Board, id: number, x: number, y: number, r: number, fillColor: string) {
    super(board, id, x, y);

    this.radius = r;
    this.fillColor = fillColor;
  }

  checkHover(pointer: [number, number]): boolean {
    const result =
      Math.sqrt(
        (pointer[0] - this.x - this.radius) ** 2 +
        (pointer[1] - this.y - this.radius) ** 2
      ) <= this.radius;
    this.isHover = result;
    return result;
  }

  draw(ctx: CanvasRenderingContext2D, board: Board) {
    ctx.beginPath();
    ctx.fillStyle = this.fillColor;
    ctx.arc(
      (this.x + this.radius - board.viewportCorner[0]) * board.scale,
      (this.y + this.radius - board.viewportCorner[1]) * board.scale,
      this.radius * board.scale,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.closePath();
  }

  drawHover(ctx: CanvasRenderingContext2D, board: Board) {
    ctx.beginPath();
    ctx.strokeStyle = COLOR_BRAND;
    ctx.lineWidth = 3;
    ctx.arc(
      (this.x + this.radius - board.viewportCorner[0]) * board.scale,
      (this.y + this.radius - board.viewportCorner[1]) * board.scale,
      this.radius * board.scale,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    ctx.closePath();
  }

  drawSelected(ctx: CanvasRenderingContext2D, board: Board) {
    ctx.beginPath();
    ctx.strokeStyle = COLOR_BRAND;
    ctx.lineWidth = 5;
    ctx.arc(
      (this.x + this.radius - board.viewportCorner[0]) * board.scale,
      (this.y + this.radius - board.viewportCorner[1]) * board.scale,
      this.radius * board.scale,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    ctx.closePath();
  }
}
