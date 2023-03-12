import { AbstractNode } from "../abstract-node";
import type { EllipseOptions } from "../node-factory";
import type { Scene } from "@/frontier/core/scene";
import { COLOR_BRAND } from "@/frontier/constants/color.constants";
import { drawSelected } from "../draw-fns/draw-selected";

export class Ellipse extends AbstractNode {
  constructor({ ctx, scene, options }: {
    ctx: CanvasRenderingContext2D;
    scene: Scene;
    options: EllipseOptions;
  }) {
    super(ctx, scene, options);
  }

  get radiusX() { return this.width / 2; }
  get radiusY() { return this.height / 2; }

  get viewRadiusX() { return this.radiusX * this.scene.scale; }
  get viewRadiusY() { return this.radiusY * this.scene.scale; }

  get checkHoverNode(): boolean {
    return ((this.scene.pointerX - this.x - this.radiusX) ** 2) / (this.radiusX ** 2) +
      ((this.scene.pointerY - this.y - this.radiusY) ** 2) / (this.radiusY ** 2)
      <= 1;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.fillColor;
    this.ctx.ellipse(
      (this.x + this.radiusX - this.scene.viewportX) * this.scene.scale,
      (this.y + this.radiusY - this.scene.viewportY) * this.scene.scale,
      this.viewRadiusX,
      this.viewRadiusY,
      0,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawHover() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = COLOR_BRAND;
    this.ctx.lineWidth = 3;
    this.ctx.ellipse(
      (this.x + this.radiusX - this.scene.viewportX) * this.scene.scale,
      (this.y + this.radiusY - this.scene.viewportY) * this.scene.scale,
      this.viewRadiusX,
      this.viewRadiusY,
      0,
      0,
      Math.PI * 2
    );
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawSelected(): void {
    return drawSelected(this);
  }
}
