import { AREA_CORNER_HALF_SIDE } from '../constants/sizes';
import type { LayerContext } from '../layers/layer';

export interface Shape {
  context: LayerContext;
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
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
  setWidth(width: number): void;
  setHeight(height: number): void;
}

export abstract class AbstractShape implements Shape {
  context: LayerContext;
  get state() { return this.context.state };
  get ctx2d() { return this.context.ctx2d };

  get offsetX() { return this.state.offsetX; }
  get offsetY() { return this.state.offsetY; }

  id: number;
  x: number;
  y: number;

  width: number = 0;
  height: number = 0;

  fillColor: string;

  isSelected: boolean = false;
  isHovered: boolean = false;

  abstract draw(): void;
  abstract drawHover(): void;
  abstract drawSelected(): void;

  setIsSelected(value: boolean): void {
    this.isSelected = value;
  };
  setX(x: number): void { this.x = x; };
  setY(y: number): void { this.y = y; };
  setWidth(width: number): void { if (width >= 20) this.width = width };
  setHeight(height: number): void { if (height >= 20) this.height = height };

  get viewLeftX() { return (this.x - this.state.viewportX) * this.state.scale; }
  get viewTopY() { return (this.y - this.state.viewportY) * this.state.scale; }
  get viewRightX() { return (this.x - this.state.viewportX + this.width) * this.state.scale; }
  get viewBottomY() { return (this.y - this.state.viewportY + this.height) * this.state.scale; }

  abstract get checkHoverShape(): boolean;

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
    this.isHovered = this.checkHoverShape;
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

  constructor(context: LayerContext, options: {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    fillColor: string;
  }) {
    this.context = context;
    this.id = options.id;
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.fillColor = options.fillColor;
  }
}
