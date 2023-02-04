import { AbstractShape } from "../abstractShape";
import { COLOR_BRAND } from "../../constants/colors";
import type { Board } from "../../board";
import type { CircleOptions } from "../shapeFactory";
import type { BoardState } from './../../boardState';
import { drawSelectedFn } from "../draw/drawSelected";

export class Circle extends AbstractShape {
  radius: number;

  get areaWidth() { return this.radius * 2; }
  get areaHeight() { return this.radius * 2; }

  constructor({ state, ctx, options: { id, x, y, fillColor, radius } }: {
    state: BoardState;
    ctx: CanvasRenderingContext2D;
    options: CircleOptions;
  }) {
    super(state, ctx, id, x, y, fillColor);

    this.radius = radius;
  }

  checkHover(): boolean {
    const result =
      Math.sqrt(
        (this.boardState.pointerX - this.x - this.radius) ** 2 +
        (this.boardState.pointerY - this.y - this.radius) ** 2
      ) <= this.radius;
    this.isHover = result;
    return result;
  }

  checkHoverLT(): boolean {
    const result =
      (this.viewX >= this.viewLeftX - 5 && this.viewX <= this.viewLeftX + 5) &&
      (this.viewY >= this.viewTopY - 5 && this.viewY <= this.viewTopY + 5);
    this.isHoverLT = result;
    return result;
  }

  checkHoverRT(): boolean {
    const result =
      (this.viewX >= this.viewRightX - 5 && this.viewX <= this.viewRightX + 5) &&
      (this.viewY >= this.viewTopY - 5 && this.viewY <= this.viewTopY + 5);
    this.isHoverRT = result;
    return result;
  }

  checkHoverLB(): boolean {
    const result =
      (this.viewX >= this.viewLeftX - 5 && this.viewX <= this.viewLeftX + 5) &&
      (this.viewY >= this.viewBottomY - 5 && this.viewY <= this.viewBottomY + 5);
    this.isHoverLB = result;
    return result;
  }

  checkHoverRB(): boolean {
    const result =
      (this.viewX >= this.viewRightX - 5 && this.viewX <= this.viewRightX + 5) &&
      (this.viewY >= this.viewBottomY - 5 && this.viewY <= this.viewBottomY + 5);
    this.isHoverRB = result;
    return result;
  }

  draw() {
    this.ctx2d.beginPath();
    this.ctx2d.fillStyle = this.fillColor;
    this.ctx2d.arc(
      (this.x + this.radius - this.boardState.viewportX) * this.boardState.scale,
      (this.y + this.radius - this.boardState.viewportY) * this.boardState.scale,
      this.radius * this.boardState.scale,
      0,
      Math.PI * 2
    );
    this.ctx2d.fill();
    this.ctx2d.closePath();
  }

  drawHover() {
    this.ctx2d.beginPath();
    this.ctx2d.strokeStyle = COLOR_BRAND;
    this.ctx2d.lineWidth = 3;
    this.ctx2d.arc(
      (this.x + this.radius - this.boardState.viewportX) * this.boardState.scale,
      (this.y + this.radius - this.boardState.viewportY) * this.boardState.scale,
      this.radius * this.boardState.scale,
      0,
      Math.PI * 2
    );
    this.ctx2d.stroke();
    this.ctx2d.closePath();
  }

  drawSelected(): void {
    return drawSelectedFn(this);
  }
}
