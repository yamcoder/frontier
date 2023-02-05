import { AREA_CORNER_HALF_SIDE } from '../constants/sizes';
import { drawSelectedFn } from '../draw-fns/draw-selected';
import type { LayerContext } from '../layers/layer';

export interface Shape {
  context: LayerContext;
  id: number;
  x: number;
  y: number;
  fillColor: string;
  isHoveredShape: boolean;
  isHoveredArea: boolean;
  isHoveredAreaLT: boolean;
  isHoveredAreaRT: boolean;
  isHoveredAreaLB: boolean;
  isHoveredAreaRB: boolean;
  isHoveredAreaT: boolean;
  isHoveredAreaR: boolean;
  isHoveredAreaB: boolean;
  isHoveredAreaL: boolean;
  isSelected: boolean;
  checkHovers(): void;
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

  isHoveredShape: boolean = false;
  isHoveredArea: boolean = false;
  isHoveredAreaLT: boolean = false;
  isHoveredAreaRT: boolean = false;
  isHoveredAreaLB: boolean = false;
  isHoveredAreaRB: boolean = false;
  isHoveredAreaT: boolean = false;
  isHoveredAreaR: boolean = false;
  isHoveredAreaB: boolean = false;
  isHoveredAreaL: boolean = false;

  isSelected: boolean = false;

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

  get checkHoverArea(): boolean {
    return (this.offsetX > this.viewLeftX + AREA_CORNER_HALF_SIDE && this.offsetX < this.viewRightX - AREA_CORNER_HALF_SIDE) &&
      (this.offsetY > this.viewTopY + AREA_CORNER_HALF_SIDE && this.offsetY < this.viewBottomY - AREA_CORNER_HALF_SIDE);
  };

  get checkHoverLT(): boolean {
    return (this.offsetX >= this.viewLeftX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewLeftX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewTopY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewTopY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverRT(): boolean {
    return (this.offsetX >= this.viewRightX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewRightX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewTopY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewTopY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverLB(): boolean {
    return (this.offsetX >= this.viewLeftX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewLeftX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewBottomY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewBottomY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverRB(): boolean {
    return (this.offsetX >= this.viewRightX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewRightX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewBottomY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewBottomY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverT(): boolean {
    return (this.offsetX > this.viewLeftX + AREA_CORNER_HALF_SIDE && this.offsetX < this.viewRightX - AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewTopY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewTopY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverR(): boolean {
    return (this.offsetX >= this.viewRightX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewRightX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY > this.viewTopY + AREA_CORNER_HALF_SIDE && this.offsetY < this.viewBottomY - AREA_CORNER_HALF_SIDE);
  }

  get checkHoverB(): boolean {
    return (this.offsetX > this.viewLeftX + AREA_CORNER_HALF_SIDE && this.offsetX < this.viewRightX - AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewBottomY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewBottomY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverL(): boolean {
    return (this.offsetX >= this.viewLeftX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewLeftX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY > this.viewTopY + AREA_CORNER_HALF_SIDE && this.offsetY < this.viewBottomY - AREA_CORNER_HALF_SIDE);
  }

  checkHovers(): void {
    this.isHoveredShape = this.checkIsHoverShape;

    if (this.isSelected) {
      this.isHoveredArea = this.checkHoverArea;
      this.isHoveredAreaLT = this.checkHoverLT;
      this.isHoveredAreaRT = this.checkHoverRT;
      this.isHoveredAreaLB = this.checkHoverLB;
      this.isHoveredAreaRB = this.checkHoverRB;
      this.isHoveredAreaT = this.checkHoverT;
      this.isHoveredAreaR = this.checkHoverR;
      this.isHoveredAreaB = this.checkHoverB;
      this.isHoveredAreaL = this.checkHoverL;
    }
  }

  constructor(context: LayerContext, id: number, x: number, y: number, fillColor: string) {
    this.context = context;
    this.id = id;
    this.x = x;
    this.y = y;
    this.fillColor = fillColor;
  }
}
