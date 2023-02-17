import { ShapeFactory, type ShapeOptions } from "../shapes/shape-factory";
import { BoardState } from '../core/board-state';
import type { Shape } from "../shapes/abstract-shape";
import { IDBService } from "../services/idb.service";
import { Subject } from "rxjs";

export type LayerContext = {
  ctx2d: CanvasRenderingContext2D;
  state: BoardState;
}

export class BoardContext {
  #shapeFactory: ShapeFactory;

  canvas = document.createElement('canvas');
  ctx2d = this.canvas.getContext('2d')!;
  idbService = new IDBService();
  state = new BoardState();
  stateChanges$ = new Subject<true>();

  nodes: Shape[] = [];

  constructor(

  ) {
    this.#shapeFactory = new ShapeFactory({ state: this.state, ctx2d: this.ctx2d });

    this.idbService
      .getState("nodes")
      .then(nodes => {
        if (Array.isArray(nodes)) {
          nodes.forEach(node => {
            this.addShape(node);
          });
        }
      })

    // this.addShape({
    //   type: 'ellipse',
    //   id: 2,
    //   x: 1750,
    //   y: 1550,
    //   width: 200,
    //   height: 150,
    //   fillColor: '#D9D9D9'
    // });
    // this.addShape({
    //   type: 'ellipse',
    //   id: 3,
    //   x: 1350,
    //   y: 1350,
    //   width: 200,
    //   height: 200,
    //   fillColor: '#EAB96F'
    // });
    // this.addShape({
    //   type: 'rectangle',
    //   id: 1,
    //   x: 1200,
    //   y: 1200,
    //   width: 200,
    //   height: 200,
    //   fillColor: '#B5E1CC'
    // });
  }

  get shapesList() {
    return this.nodes.slice().reverse().map(({ context, ...rest }) => rest);
  }

  getSelectedShape() {
    if (this.state.selectedShapeId !== 0) {
      const selectedShape = this.nodes.find(el => el.id === this.state.selectedShapeId);
      return selectedShape;
    }
  }

  addShape(options: ShapeOptions): void {
    const shape = this.#shapeFactory.create(options);
    this.nodes.push(shape);
  }

  deleteSelected(): void {
    const selectedIdx = this.nodes.findIndex(shape => shape.id === this.state.selectedShapeId);
    this.nodes.splice(selectedIdx, 1);
    this.state.selectedShapeId = 0;
    this.checkHovers();
    this.canvas.style.cursor = 'default';
  }

  unselectAll(): void {
    const selectedShape = this.nodes.find(el => el.id === this.state.selectedShapeId);
    selectedShape?.setIsSelected(false);
    this.state.selectedShapeId = 0;
    this.checkHovers();
    this.canvas.style.cursor = 'default';
  }

  moveSelectedToFront(): void {
    const selectedIdx = this.nodes.findIndex(shape => shape.id === this.state.selectedShapeId);

    const removedElement = this.nodes.splice(selectedIdx, 1);
    this.nodes.push(...removedElement);
  }

  moveSelectedToBack(): void {
    const selectedIdx = this.nodes.findIndex(shape => shape.id === this.state.selectedShapeId);

    const removedElement = this.nodes.splice(selectedIdx, 1);
    this.nodes.unshift(...removedElement);
  }

  moveSelectedToFrontByOne(): void {
    const selectedIdx = this.nodes.findIndex(shape => shape.id === this.state.selectedShapeId);

    if (selectedIdx + 1 === this.nodes.length) return;

    this.nodes[selectedIdx] = this.nodes.splice(selectedIdx + 1, 1, this.nodes[selectedIdx])[0];
  }

  moveSelectedToBackByOne(): void {
    const selectedIdx = this.nodes.findIndex(shape => shape.id === this.state.selectedShapeId);

    if (selectedIdx === 0) return;

    this.nodes[selectedIdx] = this.nodes.splice(selectedIdx - 1, 1, this.nodes[selectedIdx])[0];
  }

  draw() {
    this.ctx2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawShapes();
    this.drawHover();
    this.drawSelected();
  }

  private drawShapes(): void {
    this.nodes.forEach(obj => {
      obj.draw();
    });
  }

  private drawHover(): void {
    if (this.state.hoveredShapeId !== 0 && this.state.hoveredShapeId !== this.state.selectedShapeId) {
      const hoverElement = this.nodes.find(el => el.id === this.state.hoveredShapeId);
      hoverElement?.drawHover();
    }
  }

  private drawSelected(): void {
    if (this.state.selectedShapeId !== 0) {
      const selectedElement = this.nodes.find(el => el.id === this.state.selectedShapeId);
      selectedElement?.drawSelected();
    }
  }

  checkHovers(): void {
    this.nodes.forEach(shape => {
      shape.checkHover();
    });

    if (this.nodes.length === 0) {
      this.state.hoveredShapeId = 0;
    }

    const selectedShape = this.nodes.find(shape => shape.isSelected);

    if (selectedShape) {
      selectedShape.checkShapeControlHovers();
    } else {
      this.state.isHoverShapeControlArea = false;
      this.state.isHoverShapeControlLT = false;
      this.state.isHoverShapeControlRT = false;
      this.state.isHoverShapeControlLB = false;
      this.state.isHoverShapeControlRB = false;
      this.state.isHoverShapeControlT = false;
      this.state.isHoverShapeControlR = false;
      this.state.isHoverShapeControlB = false;
      this.state.isHoverShapeControlL = false;
    }

    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const element = this.nodes[i];

      if (element.isHovered) {
        this.state.hoveredShapeId = element.id;
        break;
      }

      this.state.hoveredShapeId = 0;
    }
  }

}
