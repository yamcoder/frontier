import { Shape } from "./shape";
import type { Board } from "../board";
import { COLOR_BRAND } from "../constants/colors";

export class Rectangle extends Shape {
  width: number;
  height: number;
  fillColor: string;

  get viewX() {
    return this.x - this.board.viewportCorner[0];
  }

  get viewY() {
    return this.y - this.board.viewportCorner[1];
  }

  constructor(board: Board, id: number, x: number, y: number, w: number, h: number, fillColor: string) {
    super(board, id, x, y);

    this.width = w;
    this.height = h;
    this.fillColor = fillColor;
  }

  checkHover(pointer: [number, number]): boolean {
    const result =
      (pointer[0] >= this.x && pointer[0] <= this.x + this.width) &&
      (pointer[1] >= this.y && pointer[1] <= this.y + this.height);
    this.isHover = result;
    return result;
  }

  draw(ctx: CanvasRenderingContext2D, board: Board) {
    ctx.beginPath();
    ctx.fillStyle = this.fillColor;
    ctx.fillRect(
      (this.x - board.viewportCorner[0]) * board.scale,
      (this.y - board.viewportCorner[1]) * board.scale,
      this.width * board.scale,
      this.height * board.scale
    );
    ctx.closePath();
  }

  drawHover(ctx: CanvasRenderingContext2D, board: Board) {
    ctx.beginPath();
    ctx.strokeStyle = COLOR_BRAND;
    ctx.lineWidth = 3;
    ctx.rect(
      (this.x - board.viewportCorner[0]) * board.scale,
      (this.y - board.viewportCorner[1]) * board.scale,
      this.width * board.scale,
      this.height * board.scale
    );
    ctx.stroke();
    ctx.closePath();
  }

  drawSelected(ctx: CanvasRenderingContext2D, board: Board) {
    const cornerHalfSize = 5;
    const cornerWidth = cornerHalfSize * 2;
    const cornerHeight = cornerHalfSize * 2;

    ctx.beginPath();
    ctx.strokeStyle = COLOR_BRAND;
    ctx.lineWidth = 2;

    // RTL
    ctx.rect(
      (this.x - board.viewportCorner[0]) * board.scale - cornerHalfSize,
      (this.y - board.viewportCorner[1]) * board.scale - cornerHalfSize,
      cornerWidth,
      cornerHeight
    );

    // RTR
    ctx.rect(
      (this.x - board.viewportCorner[0] + this.width) * board.scale - cornerHalfSize,
      (this.y - board.viewportCorner[1]) * board.scale - cornerHalfSize,
      cornerWidth,
      cornerHeight
    );

    // RBL
    ctx.rect(
      (this.x - board.viewportCorner[0]) * board.scale - cornerHalfSize,
      (this.y - board.viewportCorner[1] + this.height) * board.scale - cornerHalfSize,
      cornerWidth,
      cornerHeight
    );

    // RBR
    ctx.rect(
      (this.x - board.viewportCorner[0] + this.width) * board.scale - cornerHalfSize,
      (this.y - board.viewportCorner[1] + this.height) * board.scale - cornerHalfSize,
      cornerWidth,
      cornerHeight
    );

    // LineT
    ctx.moveTo(
      (this.x - board.viewportCorner[0]) * board.scale + cornerHalfSize,
      (this.y - board.viewportCorner[1]) * board.scale
    );
    ctx.lineTo(
      (this.x - board.viewportCorner[0] + this.width) * board.scale - cornerHalfSize,
      (this.y - board.viewportCorner[1]) * board.scale
    );

    // LineR
    ctx.moveTo(
      (this.x - board.viewportCorner[0] + this.width) * board.scale,
      (this.y - board.viewportCorner[1]) * board.scale + cornerHalfSize
    );
    ctx.lineTo(
      (this.x - board.viewportCorner[0] + this.width) * board.scale,
      (this.y - board.viewportCorner[1] + this.height) * board.scale - cornerHalfSize
    );

    // LineB
    ctx.moveTo(
      (this.x - board.viewportCorner[0] + this.width) * board.scale - cornerHalfSize,
      (this.y - board.viewportCorner[1] + this.height) * board.scale
    );
    ctx.lineTo(
      (this.x - board.viewportCorner[0]) * board.scale + cornerHalfSize,
      (this.y - board.viewportCorner[1] + this.height) * board.scale
    );

    // LineL
    ctx.moveTo(
      (this.x - board.viewportCorner[0]) * board.scale,
      (this.y - board.viewportCorner[1] + this.height) * board.scale - cornerHalfSize
    );
    ctx.lineTo(
      (this.x - board.viewportCorner[0]) * board.scale,
      (this.y - board.viewportCorner[1]) * board.scale + cornerHalfSize
    );

    ctx.stroke();
    ctx.closePath();
  }
}
