import { AbstractShape } from "../shape";
import { COLOR_BRAND } from "../../constants/colors";
import type { Board } from "../../board";
import type { CircleOptions } from "../shapeFactory";

export class Circle extends AbstractShape {
  radius: number;

  constructor({ board, options: { id, x, y, fillColor, radius } }: {
    board: Board;
    options: CircleOptions;
  }) {
    super(board, id, x, y, fillColor);

    this.radius = radius;
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

  draw() {
    this.board.ctx.beginPath();
    this.board.ctx.fillStyle = this.fillColor;
    this.board.ctx.arc(
      (this.x + this.radius - this.board.viewportCorner[0]) * this.board.scale,
      (this.y + this.radius - this.board.viewportCorner[1]) * this.board.scale,
      this.radius * this.board.scale,
      0,
      Math.PI * 2
    );
    this.board.ctx.fill();
    this.board.ctx.closePath();
  }

  drawHover() {
    this.board.ctx.beginPath();
    this.board.ctx.strokeStyle = COLOR_BRAND;
    this.board.ctx.lineWidth = 3;
    this.board.ctx.arc(
      (this.x + this.radius - this.board.viewportCorner[0]) * this.board.scale,
      (this.y + this.radius - this.board.viewportCorner[1]) * this.board.scale,
      this.radius * this.board.scale,
      0,
      Math.PI * 2
    );
    this.board.ctx.stroke();
    this.board.ctx.closePath();
  }

  drawSelected() {
    this.board.ctx.beginPath();
    this.board.ctx.strokeStyle = COLOR_BRAND;
    this.board.ctx.lineWidth = 5;
    this.board.ctx.arc(
      (this.x + this.radius - this.board.viewportCorner[0]) * this.board.scale,
      (this.y + this.radius - this.board.viewportCorner[1]) * this.board.scale,
      this.radius * this.board.scale,
      0,
      Math.PI * 2
    );
    this.board.ctx.stroke();
    this.board.ctx.closePath();
  }
}
