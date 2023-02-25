import { AREA_CORNER_HALF_SIDE } from '../constants/size.constants';
import type { Scene } from '../core/scene';

export interface Node {
  ctx: CanvasRenderingContext2D;
  scene: Scene;
  type: string;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  isSelected: boolean;
  isHovered: boolean;
  checkHover(): void;
  checkNodeControlHovers(): void;
  draw(): void;
  drawHover(): void;
  drawSelected(): void;
  setIsSelected(value: boolean): void;
  setX(value: number): void;
  setY(value: number): void;
  setWidth(value: number): void;
  setHeight(value: number): void;
}

export abstract class AbstractNode implements Node {
  ctx: CanvasRenderingContext2D;
  scene: Scene;

  get offsetX() { return this.scene.offsetX; }
  get offsetY() { return this.scene.offsetY; }

  type: string;
  id: string;
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
  setX(value: number): void { this.x = value; };
  setY(value: number): void { this.y = value; };
  setWidth(value: number): void { if (value >= 20) this.width = value };
  setHeight(value: number): void { if (value >= 20) this.height = value };

  get viewLeftX() { return (this.x - this.scene.viewportX) * this.scene.scale; }
  get viewTopY() { return (this.y - this.scene.viewportY) * this.scene.scale; }
  get viewRightX() { return (this.x - this.scene.viewportX + this.width) * this.scene.scale; }
  get viewBottomY() { return (this.y - this.scene.viewportY + this.height) * this.scene.scale; }

  abstract get checkHoverNode(): boolean;

  get checkHoverSelectedNodeArea(): boolean {
    return (this.offsetX > this.viewLeftX + AREA_CORNER_HALF_SIDE && this.offsetX < this.viewRightX - AREA_CORNER_HALF_SIDE) &&
      (this.offsetY > this.viewTopY + AREA_CORNER_HALF_SIDE && this.offsetY < this.viewBottomY - AREA_CORNER_HALF_SIDE);
  };

  get checkHoverResizeControlNW(): boolean {
    return (this.offsetX >= this.viewLeftX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewLeftX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewTopY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewTopY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverResizeControlNE(): boolean {
    return (this.offsetX >= this.viewRightX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewRightX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewTopY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewTopY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverResizeControlSW(): boolean {
    return (this.offsetX >= this.viewLeftX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewLeftX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewBottomY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewBottomY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverResizeControlSE(): boolean {
    return (this.offsetX >= this.viewRightX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewRightX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewBottomY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewBottomY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverResizeControlN(): boolean {
    return (this.offsetX > this.viewLeftX + AREA_CORNER_HALF_SIDE && this.offsetX < this.viewRightX - AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewTopY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewTopY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverResizeControlE(): boolean {
    return (this.offsetX >= this.viewRightX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewRightX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY > this.viewTopY + AREA_CORNER_HALF_SIDE && this.offsetY < this.viewBottomY - AREA_CORNER_HALF_SIDE);
  }

  get checkHoverResizeControlS(): boolean {
    return (this.offsetX > this.viewLeftX + AREA_CORNER_HALF_SIDE && this.offsetX < this.viewRightX - AREA_CORNER_HALF_SIDE) &&
      (this.offsetY >= this.viewBottomY - AREA_CORNER_HALF_SIDE && this.offsetY <= this.viewBottomY + AREA_CORNER_HALF_SIDE);
  }

  get checkHoverResizeControlW(): boolean {
    return (this.offsetX >= this.viewLeftX - AREA_CORNER_HALF_SIDE && this.offsetX <= this.viewLeftX + AREA_CORNER_HALF_SIDE) &&
      (this.offsetY > this.viewTopY + AREA_CORNER_HALF_SIDE && this.offsetY < this.viewBottomY - AREA_CORNER_HALF_SIDE);
  }

  checkHover(): void {
    this.isHovered = this.checkHoverNode;
  }

  checkNodeControlHovers(): void {
    this.scene.isHoverSelectedNodeArea = this.checkHoverSelectedNodeArea;
    this.scene.isHoverResizeControl.NW = this.checkHoverResizeControlNW;
    this.scene.isHoverResizeControl.NE = this.checkHoverResizeControlNE;
    this.scene.isHoverResizeControl.SW = this.checkHoverResizeControlSW;
    this.scene.isHoverResizeControl.SE = this.checkHoverResizeControlSE;
    this.scene.isHoverResizeControl.N = this.checkHoverResizeControlN;
    this.scene.isHoverResizeControl.E = this.checkHoverResizeControlE;
    this.scene.isHoverResizeControl.S = this.checkHoverResizeControlS;
    this.scene.isHoverResizeControl.W = this.checkHoverResizeControlW;
  }

  constructor(ctx: CanvasRenderingContext2D, scene: Scene, options: {
    type: string;
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fillColor: string;
  }) {
    this.ctx = ctx;
    this.scene = scene;
    this.type = options.type;
    this.id = options.id;
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.fillColor = options.fillColor;
  }
}
