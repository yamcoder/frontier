import { NodeFactory, NodeType, type NodeOptions } from "../nodes/node-factory";
import { Scene } from './scene';
import type { Node } from "../nodes/abstract-node";
import { IDBService } from "../services/idb.service";
import { Subject } from "rxjs";
import { v4 as uuid } from 'uuid';

export class SceneContext {
  #nodeFactory: NodeFactory;

  canvas = document.createElement('canvas');
  ctx = this.canvas.getContext('2d')!;
  scene = new Scene();
  stateChanges$ = new Subject<true>();
  idbService = new IDBService();

  nodes: Node[] = [];

  constructor() {
    this.#nodeFactory = new NodeFactory(this.scene, this.ctx);

    this.idbService
      .getState("nodes")
      .then(nodes => {
        if (Array.isArray(nodes) && nodes.length !== 0) {
          nodes.forEach(node => {
            this.addNode(node);
          });
        } else {
          this.addNode({
            type: NodeType.Ellipse,
            id: uuid(),
            x: 1750,
            y: 1550,
            width: 200,
            height: 150,
            fillColor: '#D9D9D9'
          });
          this.addNode({
            type: NodeType.Ellipse,
            id: uuid(),
            x: 1350,
            y: 1350,
            width: 200,
            height: 200,
            fillColor: '#EAB96F'
          });
          this.addNode({
            type: NodeType.Rectangle,
            id: uuid(),
            x: 1200,
            y: 1200,
            width: 200,
            height: 200,
            fillColor: '#B5E1CC'
          });
        }
      })
  }

  changeState() {
    this.stateChanges$.next(true);
  }

  get nodeList() {
    return this.nodes.slice().reverse().map(({ ctx, scene, ...rest }) => rest);
  }

  getSelectedNode() {
    if (this.scene.selectedNodeId) {
      const selectedNode = this.nodes.find(el => el.id === this.scene.selectedNodeId);
      return selectedNode;
    }
  }

  addNode(options: NodeOptions): void {
    const node = this.#nodeFactory.create(options);
    this.nodes.push(node);
  }

  deleteSelected(): void {
    const selectedIdx = this.nodes.findIndex(node => node.id === this.scene.selectedNodeId);
    this.nodes.splice(selectedIdx, 1);
    this.scene.selectedNodeId = null;
    this.checkHovers();
    this.canvas.style.cursor = 'default';
  }

  unselectAll(): void {
    const selectedNode = this.nodes.find(el => el.id === this.scene.selectedNodeId);
    selectedNode?.setIsSelected(false);
    this.scene.selectedNodeId = null;
    this.checkHovers();
    this.canvas.style.cursor = 'default';
  }

  moveSelectedToFront(): void {
    const selectedIdx = this.nodes.findIndex(node => node.id === this.scene.selectedNodeId);

    const removedElement = this.nodes.splice(selectedIdx, 1);
    this.nodes.push(...removedElement);
  }

  moveSelectedToBack(): void {
    const selectedIdx = this.nodes.findIndex(node => node.id === this.scene.selectedNodeId);

    const removedElement = this.nodes.splice(selectedIdx, 1);
    this.nodes.unshift(...removedElement);
  }

  moveSelectedToFrontByOne(): void {
    const selectedIdx = this.nodes.findIndex(node => node.id === this.scene.selectedNodeId);

    if (selectedIdx + 1 === this.nodes.length) return;

    this.nodes[selectedIdx] = this.nodes.splice(selectedIdx + 1, 1, this.nodes[selectedIdx])[0];
  }

  moveSelectedToBackByOne(): void {
    const selectedIdx = this.nodes.findIndex(node => node.id === this.scene.selectedNodeId);

    if (selectedIdx === 0) return;

    this.nodes[selectedIdx] = this.nodes.splice(selectedIdx - 1, 1, this.nodes[selectedIdx])[0];
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawNodes();
    this.drawHover();
    this.drawSelected();
    this.checkCursorStyle();
  }

  private drawNodes(): void {
    this.nodes.forEach(node => {
      node.draw();
    });
  }

  private drawHover(): void {
    if (this.scene.hoveredNodeId && this.scene.hoveredNodeId !== this.scene.selectedNodeId) {
      const hoveredNode = this.nodes.find(el => el.id === this.scene.hoveredNodeId);
      hoveredNode?.drawHover();
    }
  }

  private drawSelected(): void {
    if (this.scene.selectedNodeId) {
      const selectedNode = this.nodes.find(el => el.id === this.scene.selectedNodeId);
      selectedNode?.drawSelected();
    }
  }

  checkCursorStyle(): void {
    if (this.scene.isHoverResizeControl.NW || this.scene.isHoverResizeControl.SE) {
      this.canvas.style.cursor = 'nwse-resize';
    } else if (this.scene.isHoverResizeControl.NE || this.scene.isHoverResizeControl.SW) {
      this.canvas.style.cursor = 'nesw-resize';
    } else if (this.scene.isHoverResizeControl.N || this.scene.isHoverResizeControl.S) {
      this.canvas.style.cursor = 'ns-resize';
    } else if (this.scene.isHoverResizeControl.E || this.scene.isHoverResizeControl.W) {
      this.canvas.style.cursor = 'ew-resize';
    } else if (this.scene.creatableNodeType) {
      this.canvas.style.cursor = 'crosshair';
    } else if (this.scene.isViewportDragging) {
      this.canvas.style.cursor = 'grabbing';
    } else {
      this.canvas.style.cursor = 'default';
    }
  }

  checkHovers(): void {
    this.nodes.forEach(node => {
      node.checkHover();
    });

    if (this.nodes.length === 0) {
      this.scene.hoveredNodeId = null;
    }

    const selectedNode = this.nodes.find(node => node.isSelected);

    if (selectedNode) {
      selectedNode.checkNodeControlHovers();
    } else {
      this.scene.isHoverSelectedNodeArea = false;
      this.scene.isHoverResizeControl.NW = false;
      this.scene.isHoverResizeControl.NE = false;
      this.scene.isHoverResizeControl.SE = false;
      this.scene.isHoverResizeControl.SW = false;
      this.scene.isHoverResizeControl.N = false;
      this.scene.isHoverResizeControl.E = false;
      this.scene.isHoverResizeControl.S = false;
      this.scene.isHoverResizeControl.W = false;
    }

    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const element = this.nodes[i];

      if (element.isHovered) {
        this.scene.hoveredNodeId = element.id;
        break;
      }

      this.scene.hoveredNodeId = null;
    }
  }

}
