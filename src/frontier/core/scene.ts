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
  setSelectedNodeId(value: string | null) { this.selectedNodeId = value; }
  setHoveredNodeId(value: string | null) { this.hoveredNodeId = value; }
  setIsViewportDragging(value: boolean) { this.isViewportDragging = value; }
  setIsNodeDragging(value: boolean) { this.isNodeDragging = value; }
  setIsNodeCreating(value: boolean) { this.isNodeCreating = value; }
  setIsNodeResizing(value: boolean) { this.isNodeResizing = value; }
  setIsHoverSelectedNodeArea(value: boolean) { this.isHoverSelectedNodeArea = value; }
  setCreatableNodeType(value: NodeType | null) { this.creatableNodeType = value; }
  setIsHoverResizeControl(control: 'NW' | 'NE' | 'SE' | 'SW' | 'N' | 'E' | 'S' | 'W', value: boolean) { this.isHoverResizeControl[control] = value; }
}
