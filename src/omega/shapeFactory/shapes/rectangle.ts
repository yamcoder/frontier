import { AbstractShape } from "../shape";
import { COLOR_BRAND } from "../../constants/colors";
import type { Board } from "../../board";
import type { RectangleOptions } from "../shapeFactory";

export class Rectangle extends AbstractShape {
  width: number;
  height: number;

  get viewX() {
    return this.x - this.board.viewportCorner[0];
  }

  get viewY() {
    return this.y - this.board.viewportCorner[1];
  }

  constructor({ board, options: { id, x, y, fillColor, height, width } }: {
    board: Board;
    options: RectangleOptions;
  }) {
    super(board, id, x, y, fillColor);

    this.width = height;
    this.height = width;
  }

  checkHover(pointer: [number, number]): boolean {
    const result =
      (pointer[0] >= this.x && pointer[0] <= this.x + this.width) &&
      (pointer[1] >= this.y && pointer[1] <= this.y + this.height);
    this.isHover = result;
    return result;
  }

  draw() {
    this.board.ctx.beginPath();
    this.board.ctx.fillStyle = this.fillColor;
    this.board.ctx.fillRect(
      (this.x - this.board.viewportCorner[0]) * this.board.scale,
      (this.y - this.board.viewportCorner[1]) * this.board.scale,
      this.width * this.board.scale,
      this.height * this.board.scale
    );
    this.board.ctx.closePath();
  }

  drawHover() {
    this.board.ctx.beginPath();
    this.board.ctx.strokeStyle = COLOR_BRAND;
    this.board.ctx.lineWidth = 3;
    this.board.ctx.rect(
      (this.x - this.board.viewportCorner[0]) * this.board.scale,
      (this.y - this.board.viewportCorner[1]) * this.board.scale,
      this.width * this.board.scale,
      this.height * this.board.scale
    );
    this.board.ctx.stroke();
    this.board.ctx.closePath();
  }

  drawSelected() {
    const cornerHalfSize = 5;
    const cornerWidth = cornerHalfSize * 2;
    const cornerHeight = cornerHalfSize * 2;

    this.board.ctx.beginPath();
    this.board.ctx.strokeStyle = COLOR_BRAND;
    this.board.ctx.lineWidth = 2;

    // RTL
    this.board.ctx.rect(
      (this.x - this.board.viewportCorner[0]) * this.board.scale - cornerHalfSize,
      (this.y - this.board.viewportCorner[1]) * this.board.scale - cornerHalfSize,
      cornerWidth,
      cornerHeight
    );

    // RTR
    this.board.ctx.rect(
      (this.x - this.board.viewportCorner[0] + this.width) * this.board.scale - cornerHalfSize,
      (this.y - this.board.viewportCorner[1]) * this.board.scale - cornerHalfSize,
      cornerWidth,
      cornerHeight
    );

    // RBL
    this.board.ctx.rect(
      (this.x - this.board.viewportCorner[0]) * this.board.scale - cornerHalfSize,
      (this.y - this.board.viewportCorner[1] + this.height) * this.board.scale - cornerHalfSize,
      cornerWidth,
      cornerHeight
    );

    // RBR
    this.board.ctx.rect(
      (this.x - this.board.viewportCorner[0] + this.width) * this.board.scale - cornerHalfSize,
      (this.y - this.board.viewportCorner[1] + this.height) * this.board.scale - cornerHalfSize,
      cornerWidth,
      cornerHeight
    );

    // LineT
    this.board.ctx.moveTo(
      (this.x - this.board.viewportCorner[0]) * this.board.scale + cornerHalfSize,
      (this.y - this.board.viewportCorner[1]) * this.board.scale
    );
    this.board.ctx.lineTo(
      (this.x - this.board.viewportCorner[0] + this.width) * this.board.scale - cornerHalfSize,
      (this.y - this.board.viewportCorner[1]) * this.board.scale
    );

    // LineR
    this.board.ctx.moveTo(
      (this.x - this.board.viewportCorner[0] + this.width) * this.board.scale,
      (this.y - this.board.viewportCorner[1]) * this.board.scale + cornerHalfSize
    );
    this.board.ctx.lineTo(
      (this.x - this.board.viewportCorner[0] + this.width) * this.board.scale,
      (this.y - this.board.viewportCorner[1] + this.height) * this.board.scale - cornerHalfSize
    );

    // LineB
    this.board.ctx.moveTo(
      (this.x - this.board.viewportCorner[0] + this.width) * this.board.scale - cornerHalfSize,
      (this.y - this.board.viewportCorner[1] + this.height) * this.board.scale
    );
    this.board.ctx.lineTo(
      (this.x - this.board.viewportCorner[0]) * this.board.scale + cornerHalfSize,
      (this.y - this.board.viewportCorner[1] + this.height) * this.board.scale
    );

    // LineL
    this.board.ctx.moveTo(
      (this.x - this.board.viewportCorner[0]) * this.board.scale,
      (this.y - this.board.viewportCorner[1] + this.height) * this.board.scale - cornerHalfSize
    );
    this.board.ctx.lineTo(
      (this.x - this.board.viewportCorner[0]) * this.board.scale,
      (this.y - this.board.viewportCorner[1]) * this.board.scale + cornerHalfSize
    );

    this.board.ctx.stroke();
    this.board.ctx.closePath();
  }
}
