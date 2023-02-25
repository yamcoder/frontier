import { AbstractNode } from "../abstract-node";
import { COLOR_BRAND } from "../../constants/color.constants";
import { drawSelected } from "@/frontier/nodes/draw-fns/draw-selected";
import type { RectangleOptions } from "../node-factory";
import type { Scene } from "@/frontier/core/scene";

export class Rectangle extends AbstractNode {
  constructor({ ctx, scene, options }: {
    ctx: CanvasRenderingContext2D;
    scene: Scene;
    options: RectangleOptions;
  }) {
    super(ctx, scene, options);
  }

  get viewWidth() { return this.width * this.scene.scale; }
  get viewHeight() { return this.height * this.scene.scale; }

  get checkHoverNode(): boolean {
    return (this.scene.pointerX >= this.x && this.scene.pointerX <= this.x + this.width) &&
      (this.scene.pointerY >= this.y && this.scene.pointerY <= this.y + this.height);
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.fillColor;
    this.ctx.fillRect(
      this.viewLeftX,
      this.viewTopY,
      this.viewWidth,
      this.viewHeight
    );
    this.ctx.closePath();
  }

  drawHover() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = COLOR_BRAND;
    this.ctx.lineWidth = 3;
    this.ctx.rect(
      this.viewLeftX,
      this.viewTopY,
      this.viewWidth,
      this.viewHeight
    );
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawSelected(): void {
    return drawSelected(this);
  }
}
