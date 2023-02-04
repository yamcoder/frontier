import { AbstractShape } from "../abstract-shape";
import { COLOR_BRAND } from "../../constants/colors";
import type { CircleOptions } from "../shape-factory";
import type { LayerContext } from "@/frontear/layers/layer";
import { drawSelectedFn } from "../../draw-fns/draw-selected";

export class Circle extends AbstractShape {
  radius: number;

  get areaWidth() { return this.radius * 2; }
  get areaHeight() { return this.radius * 2; }

  constructor({ context, options: { id, x, y, fillColor, radius } }: {
    context: LayerContext;
    options: CircleOptions;
  }) {
    super(context, id, x, y, fillColor);

    this.radius = radius;
  }

  get isHoverShape(): boolean {
    return Math.sqrt(
      (this.state.pointerX - this.x - this.radius) ** 2 +
      (this.state.pointerY - this.y - this.radius) ** 2
    ) <= this.radius;
  }

  draw() {
    this.ctx2d.beginPath();
    this.ctx2d.fillStyle = this.fillColor;
    this.ctx2d.arc(
      (this.x + this.radius - this.state.viewportX) * this.state.scale,
      (this.y + this.radius - this.state.viewportY) * this.state.scale,
      this.radius * this.state.scale,
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
      (this.x + this.radius - this.state.viewportX) * this.state.scale,
      (this.y + this.radius - this.state.viewportY) * this.state.scale,
      this.radius * this.state.scale,
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
