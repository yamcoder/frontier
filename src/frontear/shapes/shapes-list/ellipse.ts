import { AbstractShape } from "../abstract-shape";
import { COLOR_BRAND } from "../../constants/colors";
import type { EllipseOptions } from "../shape-factory";
import type { LayerContext } from "@/frontear/context/context";
import { drawWidthHeightSelected } from "@/frontear/draw-fns/draw-width-height-selected";

export class Ellipse extends AbstractShape {
  constructor({ context, options }: {
    context: LayerContext;
    options: EllipseOptions;
  }) {
    super(context, options);
  }

  get radiusX() { return this.width / 2; }
  get radiusY() { return this.height / 2; }

  get viewRadiusX() { return this.radiusX * this.state.scale; }
  get viewRadiusY() { return this.radiusY * this.state.scale; }

  get checkHoverShape(): boolean {
    return ((this.state.pointerX - this.x - this.radiusX) ** 2) / (this.radiusX ** 2) +
      ((this.state.pointerY - this.y - this.radiusY) ** 2) / (this.radiusY ** 2)
      <= 1;
  }

  draw() {
    this.ctx2d.beginPath();
    this.ctx2d.fillStyle = this.fillColor;
    this.ctx2d.ellipse(
      (this.x + this.radiusX - this.state.viewportX) * this.state.scale,
      (this.y + this.radiusY - this.state.viewportY) * this.state.scale,
      this.viewRadiusX,
      this.viewRadiusY,
      0,
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
    this.ctx2d.ellipse(
      (this.x + this.radiusX - this.state.viewportX) * this.state.scale,
      (this.y + this.radiusY - this.state.viewportY) * this.state.scale,
      this.viewRadiusX,
      this.viewRadiusY,
      0,
      0,
      Math.PI * 2
    );
    this.ctx2d.stroke();
    this.ctx2d.closePath();
  }

  drawSelected(): void {
    return drawWidthHeightSelected(this);
  }
}
