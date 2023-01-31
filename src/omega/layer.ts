import { Board } from "./board";
import type { Shape } from "./shapeFactory/shape";
import { ShapeFactory, type ShapeOptions } from "./shapeFactory/shapeFactory";

export class Layer extends Board {
  private shapeFactory: ShapeFactory;

  elements: Shape[] = [];

  constructor(private board: Board) {
    super();

    this.shapeFactory = new ShapeFactory(this.board);

    this.addShape({
      type: 'rectangle',
      id: 1,
      x: 1200,
      y: 1200,
      width: 200,
      height: 200,
      fillColor: 'tomato'
    });
    this.addShape({
      type: 'circle',
      id: 2,
      x: 1750,
      y: 1550,
      radius: 100,
      fillColor: 'orange'
    });
    this.addShape({
      type: 'circle',
      id: 3,
      x: 1350,
      y: 1350,
      radius: 100,
      fillColor: '#52BE80'
    });
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

  drawHover(elementId: number): void {
    const foundElement = this.elements.find(el => el.id === elementId);
    foundElement?.drawHover();
  }

  drawSelected(element: any): void {
    if (element && element.isSelected) {
      element.drawSelected();
    }
  }
}
