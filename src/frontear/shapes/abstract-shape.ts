import { AREA_CORNER_HALF_SIDE } from '../constants/sizes';
import { drawSelectedFn } from '../draw-fns/draw-selected';
import type { LayerContext } from '../layers/layer';

export interface Shape {
  context: LayerContext;
  id: number;
  x: number;
  y: number;
  fillColor: string;
  isSelected: boolean;
  isHovered: boolean;
  checkHover(): void;
  checkShapeControlHovers(): void;
  draw(): void;
  drawHover(): void;
  drawSelected(): void;
  setIsSelected(value: boolean): void;
  setX(x: number): void;
  setY(x: number): void;
}

export abstract class AbstractShape implements Shape {
  context: LayerContext;
  get state() { return this.context.state };
  get ctx2d() { return this.context.ctx2d };

  id: number;
  x: number;
  y: number;
  fillColor: string;

  isSelected: boolean = false;
  isHovered: boolean = false;

  abstract draw(): void;
  abstract drawHover(): void;

  drawSelected(): void {
    return drawSelectedFn(this);
  }

  setIsSelected(value: boolean): void {
    this.isSelected = value;
  };
  setX(x: number): void { this.x = x; };
  setY(y: number): void { this.y = y; };

  abstract get areaWidth(): number;
  abstract get areaHeight(): number;

  get offsetX() { return this.state.offsetX; }
  get offsetY() { return this.state.offsetY; }

  get viewLeftX() { return (this.x - this.state.viewportX) * this.state.scale; }
  get viewTopY() { return (this.y - this.state.viewportY) * this.state.scale; }

  get viewWidth() { return this.areaWidth * this.state.scale; }
  get viewHeight() { return this.areaHeight * this.state.scale; }

  get viewRightX() { return (this.x - this.state.viewportX + this.areaWidth) * this.state.scale; }
  get viewBottomY() { return (this.y - this.state.viewportY + this.areaHeight) * this.state.scale; }

  abstract get checkIsHoverShape(): boolean;

  get checkHoverShapeControlArea(): boolean {
    return (this.offsetX > this.viewLeftX + AREA_CORNER_HALF_SIDE && this.offsetX < this.viewRightX - AREA_CORNER_HALF_SIDE) &&
      (this.offsetY > this.viewTopY + AREA_CORNER_HALF_SIDE && this.offsetY < this.viewBottomY - AREA_CORNER_HALF_SIDE);
  };

  get checkHoverShapeControlLT(): boolean {
    return (this.offsetX >= this.viewLeftX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewLeftX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewTopY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewTopY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverShapeControlRT(): boolean {
    return (this.offsetX >= this.viewRightX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewRightX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewTopY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewTopY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverShapeControlLB(): boolean {
    return (this.offsetX >= this.viewLeftX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewLeftX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewBottomY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewBottomY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverShapeControlRB(): boolean {
    return (this.offsetX >= this.viewRightX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewRightX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewBottomY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewBottomY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverShapeControlT(): boolean {
    return (this.offsetX > this.viewLeftX + AREA_CORNER_HALF_SIDE && this.offsetX < this.viewRightX - AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewTopY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewTopY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverShapeControlR(): boolean {
    return (this.offsetX >= this.viewRightX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewRightX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY > this.viewTopY + AREA_CORNER_HALF_SIDE && this.offsetY < this.viewBottomY - AREA_CORNER_HALF_SIDE);
  }

  get checkHoverShapeControlB(): boolean {
    return (this.offsetX > this.viewLeftX + AREA_CORNER_HALF_SIDE && this.offsetX < this.viewRightX - AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewBottomY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewBottomY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverShapeControlL(): boolean {
    return (this.offsetX >= this.viewLeftX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewLeftX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY > this.viewTopY + AREA_CORNER_HALF_SIDE && this.offsetY < this.viewBottomY - AREA_CORNER_HALF_SIDE);
  }

  checkHover(): void {
    this.isHovered = this.checkIsHoverShape;
  }

  checkShapeControlHovers(): void {
    this.state.isHoverShapeControlArea = this.checkHoverShapeControlArea;
    this.state.isHoverShapeControlLT = this.checkHoverShapeControlLT;
    this.state.isHoverShapeControlRT = this.checkHoverShapeControlRT;
    this.state.isHoverShapeControlLB = this.checkHoverShapeControlLB;
    this.state.isHoverShapeControlRB = this.checkHoverShapeControlRB;
    this.state.isHoverShapeControlT = this.checkHoverShapeControlT;
    this.state.isHoverShapeControlR = this.checkHoverShapeControlR;
    this.state.isHoverShapeControlB = this.checkHoverShapeControlB;
    this.state.isHoverShapeControlL = this.checkHoverShapeControlL;
  }

  constructor(context: LayerContext, id: number, x: number, y: number, fillColor: string) {
    this.context = context;
    this.id = id;
    this.x = x;
    this.y = y;
    this.fillColor = fillColor;
  }
}
