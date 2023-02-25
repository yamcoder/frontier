import { COLOR_BOARD_BACKGROUND, COLOR_BRAND } from "../../constants/color.constants";
import { AREA_CORNER_HALF_SIDE, AREA_CORNER_SIDE, AREA_CORNER_THICKNESS } from "../../constants/size.constants";
import type { AbstractNode } from "../abstract-node";

export const drawSelected = (nodeInstance: AbstractNode) => {
  nodeInstance.ctx.beginPath();
  nodeInstance.ctx.fillStyle = COLOR_BOARD_BACKGROUND;
  nodeInstance.ctx.strokeStyle = COLOR_BRAND;
  nodeInstance.ctx.lineWidth = AREA_CORNER_THICKNESS;

  // Left Top Corner
  nodeInstance.ctx.fillRect(
    nodeInstance.viewLeftX - AREA_CORNER_HALF_SIDE,
    nodeInstance.viewTopY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );
  nodeInstance.ctx.strokeRect(
    nodeInstance.viewLeftX - AREA_CORNER_HALF_SIDE,
    nodeInstance.viewTopY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );

  // Right Top Corner
  nodeInstance.ctx.fillRect(
    nodeInstance.viewRightX - AREA_CORNER_HALF_SIDE,
    nodeInstance.viewTopY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );
  nodeInstance.ctx.strokeRect(
    nodeInstance.viewRightX - AREA_CORNER_HALF_SIDE,
    nodeInstance.viewTopY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );

  // Left Bottom Corner
  nodeInstance.ctx.fillRect(
    nodeInstance.viewLeftX - AREA_CORNER_HALF_SIDE,
    nodeInstance.viewBottomY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );
  nodeInstance.ctx.strokeRect(
    nodeInstance.viewLeftX - AREA_CORNER_HALF_SIDE,
    nodeInstance.viewBottomY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );

  // Right Bottom Corner
  nodeInstance.ctx.fillRect(
    nodeInstance.viewRightX - AREA_CORNER_HALF_SIDE,
    nodeInstance.viewBottomY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );
  nodeInstance.ctx.strokeRect(
    nodeInstance.viewRightX - AREA_CORNER_HALF_SIDE,
    nodeInstance.viewBottomY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );

  // Top Side Line
  nodeInstance.ctx.moveTo(
    nodeInstance.viewLeftX + AREA_CORNER_HALF_SIDE,
    nodeInstance.viewTopY
  );
  nodeInstance.ctx.lineTo(
    nodeInstance.viewRightX - AREA_CORNER_HALF_SIDE,
    nodeInstance.viewTopY
  );

  // Right Side Line
  nodeInstance.ctx.moveTo(
    nodeInstance.viewRightX,
    nodeInstance.viewTopY + AREA_CORNER_HALF_SIDE
  );
  nodeInstance.ctx.lineTo(
    nodeInstance.viewRightX,
    nodeInstance.viewBottomY - AREA_CORNER_HALF_SIDE
  );

  // Bottom Side Line
  nodeInstance.ctx.moveTo(
    nodeInstance.viewRightX - AREA_CORNER_HALF_SIDE,
    nodeInstance.viewBottomY
  );
  nodeInstance.ctx.lineTo(
    nodeInstance.viewLeftX + AREA_CORNER_HALF_SIDE,
    nodeInstance.viewBottomY
  );

  // Left Side Line
  nodeInstance.ctx.moveTo(
    nodeInstance.viewLeftX,
    nodeInstance.viewBottomY - AREA_CORNER_HALF_SIDE
  );
  nodeInstance.ctx.lineTo(
    nodeInstance.viewLeftX,
    nodeInstance.viewTopY + AREA_CORNER_HALF_SIDE
  );

  nodeInstance.ctx.stroke();
  nodeInstance.ctx.closePath();
}
