import type { NodeType } from "../nodes/node-factory";

export class Scene {
  scale = 1;
  viewportX = 1000;
  viewportY = 1000;
  pointerX = 0;
  pointerY = 0;
  offsetX = 0;
  offsetY = 0;
  selectedNodeId: string | null = null;
  hoveredNodeId: string | null = null;
  isViewportDragging = false;
  isNodeDragging = false;
  isNodeCreating = false;
  isNodeResizing = false;
  isHoverSelectedNodeArea = false;
  creatableNodeType: NodeType | null = null;

  /*
    N - North
    E - East
    S - South
    W - West
    */
  isHoverResizeControl = {
    NW: false,
    NE: false,
    SE: false,
    SW: false,
    N: false,
    E: false,
    S: false,
    W: false,
  };

  get isHoverResizeControls(): boolean {
    return (
      this.isHoverResizeControl.NW ||
      this.isHoverResizeControl.NE ||
      this.isHoverResizeControl.SE ||
      this.isHoverResizeControl.SW ||
      this.isHoverResizeControl.N ||
      this.isHoverResizeControl.E ||
      this.isHoverResizeControl.S ||
      this.isHoverResizeControl.W
    )
  };

  setScale(value: number) { this.scale = value; }
  setViewportX(value: number) { this.viewportX = value; }
  setViewportY(value: number) { this.viewportY = value; }
  setPointerX(value: number) { this.pointerX = value; }
  setPointerY(value: number) { this.pointerY = value; }
  setOffsetX(value: number) { this.offsetX = value; }
  setOffsetY(value: number) { this.offsetY = value; }
}
