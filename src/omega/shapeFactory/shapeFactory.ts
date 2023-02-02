import type { Shape } from "./abstractShape";
import { Rectangle } from "./shapes/rectangle";
import { Circle } from "./shapes/circle";
import type { Board } from './../board';
import type { BoardState } from "../boardState";

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
  constructor(private state: BoardState, private ctx: CanvasRenderingContext2D) { }

  create(options: ShapeOptions): Shape {
    if (isRectangleOptions(options)) {
      return new Rectangle({ state: this.state, ctx: this.ctx, options });
    }

    if (isCircleOptions(options)) {
      return new Circle({ state: this.state, ctx: this.ctx, options });
    }

    throw new Error('SHAPE_TYPE_ERROR');
  }
}
