import type { Shape } from "./shape";
import { Rectangle, Circle } from "./shapes";
import type { Board } from './../board';

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
  constructor(private board: Board) { }

  create(options: ShapeOptions): Shape {
    if (isRectangleOptions(options)) {
      return new Rectangle({ board: this.board, options });
    }

    if (isCircleOptions(options)) {
      return new Circle({ board: this.board, options });
    }

    throw new Error('SHAPE_TYPE_ERROR');
  }
}
