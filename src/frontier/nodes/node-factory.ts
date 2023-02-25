import type { Node } from "./abstract-node";
import { Rectangle } from "./shapes/rectangle";
import { Ellipse } from "./shapes/ellipse";
import type { Scene } from '../core/scene';

export const enum NodeType {
  Rectangle = 'RECTANGLE',
  Ellipse = 'ELLIPSE',
}

export interface NodeBaseOptions {
  type: NodeType;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
}

export interface RectangleOptions extends NodeBaseOptions {
  type: NodeType.Rectangle;
}

export interface EllipseOptions extends NodeBaseOptions {
  type: NodeType.Ellipse;
}

export type NodeOptions = RectangleOptions | EllipseOptions

const isRectangleOptions = (options: NodeOptions): options is RectangleOptions => options.type === NodeType.Rectangle;
const isEllipseOptions = (options: NodeOptions): options is EllipseOptions => options.type === NodeType.Ellipse;

export class NodeFactory {
  constructor(private scene: Scene, private ctx: CanvasRenderingContext2D) { }

  create(options: NodeOptions): Node {
    if (isRectangleOptions(options)) {
      return new Rectangle({ ctx: this.ctx, scene: this.scene, options });
    }

    if (isEllipseOptions(options)) {
      return new Ellipse({ ctx: this.ctx, scene: this.scene, options });
    }

    throw new Error('UNKNOWN_NODE_TYPE_ERROR');
  }
}
