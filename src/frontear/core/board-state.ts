export class BoardState {
  scale = 1;
  viewportX: number = 1000;
  viewportY: number = 1000;
  pointerX: number = 0;
  pointerY: number = 0;
  offsetX: number = 0;
  offsetY: number = 0;
  selectedShapeId: number = 0;
  hoveredShapeId: number = 0;
  isDragging: boolean = false;
  isSizing: boolean = false;
  isHoverShapeControlArea: boolean = false;
  isHoverShapeControlLT: boolean = false;
  isHoverShapeControlRT: boolean = false;
  isHoverShapeControlLB: boolean = false;
  isHoverShapeControlRB: boolean = false;
  isHoverShapeControlT: boolean = false;
  isHoverShapeControlR: boolean = false;
  isHoverShapeControlB: boolean = false;
  isHoverShapeControlL: boolean = false;

  get isHoverShapeControlBoundary(): boolean {
    return (
      this.isHoverShapeControlB ||
      this.isHoverShapeControlL ||
      this.isHoverShapeControlR ||
      this.isHoverShapeControlT ||
      this.isHoverShapeControlLT ||
      this.isHoverShapeControlRT ||
      this.isHoverShapeControlLB ||
      this.isHoverShapeControlRB
    )
  };
}
