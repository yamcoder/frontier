import type { LayerContext } from '../layers/layer';

export interface Shape {
  context: LayerContext;
  id: number;
  x: number;
  y: number;
  fillColor: string;
  isHoveredShape: boolean;
  isHoveredLT: boolean;
  isHoveredRT: boolean;
  isHoveredLB: boolean;
  isHoveredRB: boolean;
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
  isHoveredLT: boolean = false;
  isHoveredRT: boolean = false;
  isHoveredLB: boolean = false;
  isHoveredRB: boolean = false;

  isSelected: boolean = false;

  abstract draw(): void;
  abstract drawHover(): void;
  abstract drawSelected(): void;
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

  abstract get isHoverShape(): boolean;

  get isHoverLT(): boolean {
    return (this.offsetX >= this.viewLeftX - 5 && this.offsetX <= this.viewLeftX + 5) &&
      (this.offsetY >= this.viewTopY - 5 && this.offsetY <= this.viewTopY + 5);
  }

  get isHoverRT(): boolean {
    return (this.offsetX >= this.viewRightX - 5 && this.offsetX <= this.viewRightX + 5) &&
      (this.offsetY >= this.viewTopY - 5 && this.offsetY <= this.viewTopY + 5);
  }

  get isHoverLB(): boolean {
    return (this.offsetX >= this.viewLeftX - 5 && this.offsetX <= this.viewLeftX + 5) &&
      (this.offsetY >= this.viewBottomY - 5 && this.offsetY <= this.viewBottomY + 5);
  }

  get isHoverRB(): boolean {
    return (this.offsetX >= this.viewRightX - 5 && this.offsetX <= this.viewRightX + 5) &&
      (this.offsetY >= this.viewBottomY - 5 && this.offsetY <= this.viewBottomY + 5);
  }

  checkHovers(): void {
    this.isHoveredShape = this.isHoverShape;
    this.isHoveredLT = this.isHoverLT;
    this.isHoveredRT = this.isHoverRT;
    this.isHoveredLB = this.isHoverLB;
    this.isHoveredRB = this.isHoverRB;
  }

  constructor(context: LayerContext, id: number, x: number, y: number, fillColor: string) {
    this.context = context;
    this.id = id;
    this.x = x;
    this.y = y;
    this.fillColor = fillColor;
  }
}
