import type { Board } from "../board";
import type { Shape } from "../shapeFactory/abstractShape";
import { ShapeFactory, type ShapeOptions } from "../shapeFactory/shapeFactory";
import type { BoardState } from './../boardState';

export class Layer {
  private shapeFactory: ShapeFactory;

  elements: Shape[] = [];

  constructor(private state: BoardState, private ctx: CanvasRenderingContext2D) {
    this.shapeFactory = new ShapeFactory(this.state, this.ctx);

    this.addShape({
      type: 'rectangle',
      id: 1,
      x: 1200,
      y: 1200,
      width: 200,
      height: 200,
      fillColor: '#B5E1CC'
    });
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
  }

  get elementsViewList() {
    return this.elements.slice().reverse().map(({ context, ...rest }) => rest);
  }

  addShape(options: ShapeOptions): void {
    const shape = this.shapeFactory.create(options);
    this.elements.push(shape);
  }

  draw(): void {
    this.elements.forEach(obj => {
      obj.draw();
    });
  }

  drawHover(): void {
    if (this.state.hoverElementId !== 0 && this.state.hoverElementId !== this.state.selectedElementId) {
      const hoverElement = this.elements.find(el => el.id === this.state.hoverElementId);
      hoverElement?.drawHover();
    }
  }

  drawSelected(): void {
    if (this.state.selectedElementId !== 0) {
      const selectedElement = this.elements.find(el => el.id === this.state.selectedElementId);
      selectedElement?.drawSelected();
    }
  }
}
