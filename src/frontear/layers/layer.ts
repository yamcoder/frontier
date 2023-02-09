import { ShapeFactory, type ShapeOptions } from "../shapes/shape-factory";
import type { BoardState } from '../core/board-state';
import type { Shape } from "../shapes/abstract-shape";

export type LayerContext = {
  ctx2d: CanvasRenderingContext2D;
  state: BoardState;
}

export class Layer {
  #shapeFactory: ShapeFactory;

  readonly shapes: Shape[] = [];

  constructor(private canvas: HTMLCanvasElement, private ctx2d: CanvasRenderingContext2D, private state: BoardState) {
    this.#shapeFactory = new ShapeFactory({ state: this.state, ctx2d: this.ctx2d });

    this.addShape({
      type: 'circle',
      id: 2,
      x: 1750,
      y: 1550,
      radius: 100,
      fillColor: '#D9D9D9'
    });
    this.addShape({
      type: 'circle',
      id: 3,
      x: 1350,
      y: 1350,
      radius: 100,
      fillColor: '#EAB96F'
    });
    this.addShape({
      type: 'rectangle',
      id: 1,
      x: 1200,
      y: 1200,
      width: 200,
      height: 200,
      fillColor: '#B5E1CC'
    });
  }

  get shapesList() {
    return this.shapes.slice().reverse().map(({ context, ...rest }) => rest);
  }

  getSelectedShape() {
    if (this.state.selectedShapeId !== 0) {
      const selectedShape = this.shapes.find(el => el.id === this.state.selectedShapeId);
      return selectedShape;
    }
  }

  addShape(options: ShapeOptions): void {
    const shape = this.#shapeFactory.create(options);
    this.shapes.push(shape);
  }

  draw() {
    this.ctx2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawShapes();
    this.drawHover();
    this.drawSelected();
  }

  private drawShapes(): void {
    this.shapes.forEach(obj => {
      obj.draw();
    });
  }

  private drawHover(): void {
    if (this.state.hoveredShapeId !== 0 && this.state.hoveredShapeId !== this.state.selectedShapeId) {
      const hoverElement = this.shapes.find(el => el.id === this.state.hoveredShapeId);
      hoverElement?.drawHover();
    }
  }

  private drawSelected(): void {
    if (this.state.selectedShapeId !== 0) {
      const selectedElement = this.shapes.find(el => el.id === this.state.selectedShapeId);
      selectedElement?.drawSelected();
    }
  }

  checkHovers(): void {
    this.shapes.forEach(shape => {
      shape.checkHover();
      shape.checkShapeControlHovers();
    });

    const selectedShape = this.shapes.find(shape => shape.isSelected);

    if (selectedShape) {
      selectedShape.checkShapeControlHovers();
    } else {
      this.state.isHoverShapeControlArea = false;
      // this.state.isHoverShapeControlLT = false;
      // this.state.isHoverShapeControlRT = false;
      // this.state.isHoverShapeControlLB = false;
      // this.state.isHoverShapeControlRB = false;
      // this.state.isHoverShapeControlT = false;
      // this.state.isHoverShapeControlR = false;
      // this.state.isHoverShapeControlB = false;
      // this.state.isHoverShapeControlL = false;
    }

    for (let i = this.shapes.length - 1; i >= 0; i--) {
      const element = this.shapes[i];

      if (element.isHovered) {
        this.state.hoveredShapeId = element.id;
        break;
      }

      this.state.hoveredShapeId = 0;
    }
  }

}
