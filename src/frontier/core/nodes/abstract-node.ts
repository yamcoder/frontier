import { RESIZE_CONTROL_CORNER_HALF_SIDE } from "@/frontier/constants/size.constants";
import type { Scene } from "../scene";

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
    return (this.offsetX > this.viewLeftX + RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetX < this.viewRightX - RESIZE_CONTROL_CORNER_HALF_SIDE) &&
      (this.offsetY > this.viewTopY + RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetY < this.viewBottomY - RESIZE_CONTROL_CORNER_HALF_SIDE);
  };

  get checkHoverResizeControl() {
    return {
      NW: (this.offsetX >= this.viewLeftX - RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetX <= this.viewLeftX + RESIZE_CONTROL_CORNER_HALF_SIDE) &&
        (this.offsetY >= this.viewTopY - RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetY <= this.viewTopY + RESIZE_CONTROL_CORNER_HALF_SIDE),
      NE: (this.offsetX >= this.viewRightX - RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetX <= this.viewRightX + RESIZE_CONTROL_CORNER_HALF_SIDE) &&
        (this.offsetY >= this.viewTopY - RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetY <= this.viewTopY + RESIZE_CONTROL_CORNER_HALF_SIDE),
      SW: (this.offsetX >= this.viewLeftX - RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetX <= this.viewLeftX + RESIZE_CONTROL_CORNER_HALF_SIDE) &&
        (this.offsetY >= this.viewBottomY - RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetY <= this.viewBottomY + RESIZE_CONTROL_CORNER_HALF_SIDE),
      SE: (this.offsetX >= this.viewRightX - RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetX <= this.viewRightX + RESIZE_CONTROL_CORNER_HALF_SIDE) &&
        (this.offsetY >= this.viewBottomY - RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetY <= this.viewBottomY + RESIZE_CONTROL_CORNER_HALF_SIDE),
      N: (this.offsetX > this.viewLeftX + RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetX < this.viewRightX - RESIZE_CONTROL_CORNER_HALF_SIDE) &&
        (this.offsetY >= this.viewTopY - RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetY <= this.viewTopY + RESIZE_CONTROL_CORNER_HALF_SIDE),
      E: (this.offsetX >= this.viewRightX - RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetX <= this.viewRightX + RESIZE_CONTROL_CORNER_HALF_SIDE) &&
        (this.offsetY > this.viewTopY + RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetY < this.viewBottomY - RESIZE_CONTROL_CORNER_HALF_SIDE),
      S: (this.offsetX > this.viewLeftX + RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetX < this.viewRightX - RESIZE_CONTROL_CORNER_HALF_SIDE) &&
        (this.offsetY >= this.viewBottomY - RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetY <= this.viewBottomY + RESIZE_CONTROL_CORNER_HALF_SIDE),
      W: (this.offsetX >= this.viewLeftX - RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetX <= this.viewLeftX + RESIZE_CONTROL_CORNER_HALF_SIDE) &&
        (this.offsetY > this.viewTopY + RESIZE_CONTROL_CORNER_HALF_SIDE && this.offsetY < this.viewBottomY - RESIZE_CONTROL_CORNER_HALF_SIDE)
    }
  }

  checkHover(): void {
    this.isHovered = this.checkHoverNode;
  }

  checkNodeControlHovers(): void {
    this.scene.setIsHoverSelectedNodeArea(this.checkHoverSelectedNodeArea);
    this.scene.setIsHoverResizeControl('NW', this.checkHoverResizeControl.NW);
    this.scene.setIsHoverResizeControl('NE', this.checkHoverResizeControl.NE);
    this.scene.setIsHoverResizeControl('SW', this.checkHoverResizeControl.SW);
    this.scene.setIsHoverResizeControl('SE', this.checkHoverResizeControl.SE);
    this.scene.setIsHoverResizeControl('N', this.checkHoverResizeControl.N);
    this.scene.setIsHoverResizeControl('E', this.checkHoverResizeControl.E);
    this.scene.setIsHoverResizeControl('S', this.checkHoverResizeControl.S);
    this.scene.setIsHoverResizeControl('W', this.checkHoverResizeControl.W);
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
