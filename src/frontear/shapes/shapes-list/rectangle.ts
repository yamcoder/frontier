import { AbstractShape } from "../abstract-shape";
import { COLOR_BRAND } from "../../constants/colors";
import type { RectangleOptions } from "../shape-factory";
import type { LayerContext } from "@/frontear/layers/layer";

export class Rectangle extends AbstractShape {
  width: number;
  height: number;

  get areaWidth() { return this.width; }
  get areaHeight() { return this.height; }

  constructor({ context, options: { id, x, y, fillColor, height, width } }: {
    context: LayerContext;
    options: RectangleOptions;
  }) {
    super(context, id, x, y, fillColor);

    this.width = height;
    this.height = width;
  }

  get checkIsHoverShape(): boolean {
    return (this.state.pointerX >= this.x && this.state.pointerX <= this.x + this.width) &&
      (this.state.pointerY >= this.y && this.state.pointerY <= this.y + this.height);
  }

  draw() {
    this.ctx2d.beginPath();
    this.ctx2d.fillStyle = this.fillColor;
    this.ctx2d.fillRect(
      this.viewLeftX,
      this.viewTopY,
      this.viewWidth,
      this.viewHeight
    );
    this.ctx2d.closePath();
  }

  drawHover() {
    this.ctx2d.beginPath();
    this.ctx2d.strokeStyle = COLOR_BRAND;
    this.ctx2d.lineWidth = 3;
    this.ctx2d.rect(
      this.viewLeftX,
      this.viewTopY,
      this.viewWidth,
      this.viewHeight
    );
    this.ctx2d.stroke();
    this.ctx2d.closePath();
  }
}
