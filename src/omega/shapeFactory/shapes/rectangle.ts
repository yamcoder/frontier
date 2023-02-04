import { AbstractShape } from "../abstractShape";
import { COLOR_BRAND } from "../../constants/colors";
import type { RectangleOptions } from "../shapeFactory";
import type { BoardState } from './../../boardState';
import { drawSelectedFn } from "../draw/drawSelected";

export class Rectangle extends AbstractShape {
  width: number;
  height: number;

  get areaWidth() { return this.width; }
  get areaHeight() { return this.height; }

  constructor({ state, ctx, options: { id, x, y, fillColor, height, width } }: {
    state: BoardState;
    ctx: CanvasRenderingContext2D;
    options: RectangleOptions;
  }) {
    super(state, ctx, id, x, y, fillColor);

    this.width = height;
    this.height = width;
  }

  checkHover(): boolean {
    const result =
      (this.boardState.pointerX >= this.x && this.boardState.pointerX <= this.x + this.width) &&
      (this.boardState.pointerY >= this.y && this.boardState.pointerY <= this.y + this.height);
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
    this.ctx2d.fillRect(
      this.viewLeftX,
      this.viewTopY,
      this.viewWidth,
      this.viewHeight
    );
    this.ctx2d.closePath();
  }

  drawHover() {
    this.ctx2d.beginPath();
    this.ctx2d.strokeStyle = COLOR_BRAND;
    this.ctx2d.lineWidth = 3;
    this.ctx2d.rect(
      this.viewLeftX,
      this.viewTopY,
      this.viewWidth,
      this.viewHeight
    );
    this.ctx2d.stroke();
    this.ctx2d.closePath();
  }

  drawSelected(): void {
    return drawSelectedFn(this);
  }
}
