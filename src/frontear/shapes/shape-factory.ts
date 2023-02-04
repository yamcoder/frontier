import type { Shape } from "./abstract-shape";
import { Rectangle } from "./shapes-list/rectangle";
import { Circle } from "./shapes-list/circle";
import type { LayerContext } from "../layers/layer";

export interface ShapeBaseOptions {
  type: 'rectangle' | 'circle';
  id: number;
  x: number;
  y: number;
  fillColor: string;
}

export interface RectangleOptions extends ShapeBaseOptions {
  type: 'rectangle';
  width: number;
  height: number;
}

export interface CircleOptions extends ShapeBaseOptions {
  type: 'circle';
  radius: number;
}

export type ShapeOptions = RectangleOptions | CircleOptions

const isRectangleOptions = (options: ShapeOptions): options is RectangleOptions => options.type === 'rectangle';

const isCircleOptions = (options: ShapeOptions): options is CircleOptions => options.type === 'circle';

export class ShapeFactory {
  constructor(private context: LayerContext) { }

  create(options: ShapeOptions): Shape {
    if (isRectangleOptions(options)) {
      return new Rectangle({ context: this.context, options });
    }

    if (isCircleOptions(options)) {
      return new Circle({ context: this.context, options });
    }

    throw new Error('SHAPE_TYPE_ERROR');
  }
}
