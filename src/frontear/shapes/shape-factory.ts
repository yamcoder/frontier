import type { Shape } from "./abstract-shape";
import { Rectangle } from "./shapes-list/rectangle";
import { Ellipse } from "./shapes-list/ellipse";
import type { LayerContext } from "../layers/layer";

export interface ShapeBaseOptions {
  type: 'rectangle' | 'ellipse';
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
}

export interface RectangleOptions extends ShapeBaseOptions {
  type: 'rectangle';
}

export interface EllipseOptions extends ShapeBaseOptions {
  type: 'ellipse';
  // radius: number;
}

export type ShapeOptions = RectangleOptions | EllipseOptions

const isRectangleOptions = (options: ShapeOptions): options is RectangleOptions => options.type === 'rectangle';

const isEllipseOptions = (options: ShapeOptions): options is EllipseOptions => options.type === 'ellipse';

export class ShapeFactory {
  constructor(private context: LayerContext) { }

  create(options: ShapeOptions): Shape {
    if (isRectangleOptions(options)) {
      return new Rectangle({ context: this.context, options });
    }

    if (isEllipseOptions(options)) {
      return new Ellipse({ context: this.context, options });
    }

    throw new Error('SHAPE_TYPE_ERROR');
  }
}
