import { COLOR_BOARD_BACKGROUND, COLOR_BRAND } from "@/frontier/constants/color.constants";
import { RESIZE_CONTROL_THICKNESS, RESIZE_CONTROL_CORNER_HALF_SIDE, RESIZE_CONTROL_CORNER_SIDE } from "@/frontier/constants/size.constants";
import type { AbstractNode } from "../abstract-node";

export const drawSelected = (nodeInstance: AbstractNode) => {
  nodeInstance.ctx.beginPath();
  nodeInstance.ctx.fillStyle = COLOR_BOARD_BACKGROUND;
  nodeInstance.ctx.strokeStyle = COLOR_BRAND;
  nodeInstance.ctx.lineWidth = RESIZE_CONTROL_THICKNESS;

  // Left Top Corner
  nodeInstance.ctx.fillRect(
    nodeInstance.viewLeftX - RESIZE_CONTROL_CORNER_HALF_SIDE,
    nodeInstance.viewTopY - RESIZE_CONTROL_CORNER_HALF_SIDE,
    RESIZE_CONTROL_CORNER_SIDE,
    RESIZE_CONTROL_CORNER_SIDE
  );
  nodeInstance.ctx.strokeRect(
    nodeInstance.viewLeftX - RESIZE_CONTROL_CORNER_HALF_SIDE,
    nodeInstance.viewTopY - RESIZE_CONTROL_CORNER_HALF_SIDE,
    RESIZE_CONTROL_CORNER_SIDE,
    RESIZE_CONTROL_CORNER_SIDE
  );

  // Right Top Corner
  nodeInstance.ctx.fillRect(
    nodeInstance.viewRightX - RESIZE_CONTROL_CORNER_HALF_SIDE,
    nodeInstance.viewTopY - RESIZE_CONTROL_CORNER_HALF_SIDE,
    RESIZE_CONTROL_CORNER_SIDE,
    RESIZE_CONTROL_CORNER_SIDE
  );
  nodeInstance.ctx.strokeRect(
    nodeInstance.viewRightX - RESIZE_CONTROL_CORNER_HALF_SIDE,
    nodeInstance.viewTopY - RESIZE_CONTROL_CORNER_HALF_SIDE,
    RESIZE_CONTROL_CORNER_SIDE,
    RESIZE_CONTROL_CORNER_SIDE
  );

  // Left Bottom Corner
  nodeInstance.ctx.fillRect(
    nodeInstance.viewLeftX - RESIZE_CONTROL_CORNER_HALF_SIDE,
    nodeInstance.viewBottomY - RESIZE_CONTROL_CORNER_HALF_SIDE,
    RESIZE_CONTROL_CORNER_SIDE,
    RESIZE_CONTROL_CORNER_SIDE
  );
  nodeInstance.ctx.strokeRect(
    nodeInstance.viewLeftX - RESIZE_CONTROL_CORNER_HALF_SIDE,
    nodeInstance.viewBottomY - RESIZE_CONTROL_CORNER_HALF_SIDE,
    RESIZE_CONTROL_CORNER_SIDE,
    RESIZE_CONTROL_CORNER_SIDE
  );

  // Right Bottom Corner
  nodeInstance.ctx.fillRect(
    nodeInstance.viewRightX - RESIZE_CONTROL_CORNER_HALF_SIDE,
    nodeInstance.viewBottomY - RESIZE_CONTROL_CORNER_HALF_SIDE,
    RESIZE_CONTROL_CORNER_SIDE,
    RESIZE_CONTROL_CORNER_SIDE
  );
  nodeInstance.ctx.strokeRect(
    nodeInstance.viewRightX - RESIZE_CONTROL_CORNER_HALF_SIDE,
    nodeInstance.viewBottomY - RESIZE_CONTROL_CORNER_HALF_SIDE,
    RESIZE_CONTROL_CORNER_SIDE,
    RESIZE_CONTROL_CORNER_SIDE
  );

  // Top Side Line
  nodeInstance.ctx.moveTo(
    nodeInstance.viewLeftX + RESIZE_CONTROL_CORNER_HALF_SIDE,
    nodeInstance.viewTopY
  );
  nodeInstance.ctx.lineTo(
    nodeInstance.viewRightX - RESIZE_CONTROL_CORNER_HALF_SIDE,
    nodeInstance.viewTopY
  );

  // Right Side Line
  nodeInstance.ctx.moveTo(
    nodeInstance.viewRightX,
    nodeInstance.viewTopY + RESIZE_CONTROL_CORNER_HALF_SIDE
  );
  nodeInstance.ctx.lineTo(
    nodeInstance.viewRightX,
    nodeInstance.viewBottomY - RESIZE_CONTROL_CORNER_HALF_SIDE
  );

  // Bottom Side Line
  nodeInstance.ctx.moveTo(
    nodeInstance.viewRightX - RESIZE_CONTROL_CORNER_HALF_SIDE,
    nodeInstance.viewBottomY
  );
  nodeInstance.ctx.lineTo(
    nodeInstance.viewLeftX + RESIZE_CONTROL_CORNER_HALF_SIDE,
    nodeInstance.viewBottomY
  );

  // Left Side Line
  nodeInstance.ctx.moveTo(
    nodeInstance.viewLeftX,
    nodeInstance.viewBottomY - RESIZE_CONTROL_CORNER_HALF_SIDE
  );
  nodeInstance.ctx.lineTo(
    nodeInstance.viewLeftX,
    nodeInstance.viewTopY + RESIZE_CONTROL_CORNER_HALF_SIDE
  );

  nodeInstance.ctx.stroke();
  nodeInstance.ctx.closePath();
}
