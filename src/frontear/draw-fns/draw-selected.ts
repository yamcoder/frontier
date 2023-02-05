import { COLOR_BOARD_BACKGROUND, COLOR_BRAND } from "../constants/colors";
import { AREA_CORNER_HALF_SIDE, AREA_CORNER_SIDE, AREA_CORNER_THICKNESS } from "../constants/sizes";
import type { AbstractShape } from "../shapes/abstract-shape";

export const drawSelectedFn = (shapeInstance: AbstractShape) => {
  shapeInstance.ctx2d.beginPath();
  shapeInstance.ctx2d.fillStyle = COLOR_BOARD_BACKGROUND;
  shapeInstance.ctx2d.strokeStyle = COLOR_BRAND;
  shapeInstance.ctx2d.lineWidth = AREA_CORNER_THICKNESS;

  // Left Top Corner
  shapeInstance.ctx2d.fillRect(
    shapeInstance.viewLeftX - AREA_CORNER_HALF_SIDE,
    shapeInstance.viewTopY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );
  shapeInstance.ctx2d.strokeRect(
    shapeInstance.viewLeftX - AREA_CORNER_HALF_SIDE,
    shapeInstance.viewTopY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );

  // Right Top Corner
  shapeInstance.ctx2d.fillRect(
    shapeInstance.viewRightX - AREA_CORNER_HALF_SIDE,
    shapeInstance.viewTopY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );
  shapeInstance.ctx2d.strokeRect(
    shapeInstance.viewRightX - AREA_CORNER_HALF_SIDE,
    shapeInstance.viewTopY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );

  // Left Bottom Corner
  shapeInstance.ctx2d.fillRect(
    shapeInstance.viewLeftX - AREA_CORNER_HALF_SIDE,
    shapeInstance.viewBottomY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );
  shapeInstance.ctx2d.strokeRect(
    shapeInstance.viewLeftX - AREA_CORNER_HALF_SIDE,
    shapeInstance.viewBottomY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );

  // Right Bottom Corner
  shapeInstance.ctx2d.fillRect(
    shapeInstance.viewRightX - AREA_CORNER_HALF_SIDE,
    shapeInstance.viewBottomY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );
  shapeInstance.ctx2d.strokeRect(
    shapeInstance.viewRightX - AREA_CORNER_HALF_SIDE,
    shapeInstance.viewBottomY - AREA_CORNER_HALF_SIDE,
    AREA_CORNER_SIDE,
    AREA_CORNER_SIDE
  );

  // Top Side Line
  shapeInstance.ctx2d.moveTo(
    shapeInstance.viewLeftX + AREA_CORNER_HALF_SIDE,
    shapeInstance.viewTopY
  );
  shapeInstance.ctx2d.lineTo(
    shapeInstance.viewRightX - AREA_CORNER_HALF_SIDE,
    shapeInstance.viewTopY
  );

  // Right Side Line
  shapeInstance.ctx2d.moveTo(
    shapeInstance.viewRightX,
    shapeInstance.viewTopY + AREA_CORNER_HALF_SIDE
  );
  shapeInstance.ctx2d.lineTo(
    shapeInstance.viewRightX,
    shapeInstance.viewBottomY - AREA_CORNER_HALF_SIDE
  );

  // Bottom Side Line
  shapeInstance.ctx2d.moveTo(
    shapeInstance.viewRightX - AREA_CORNER_HALF_SIDE,
    shapeInstance.viewBottomY
  );
  shapeInstance.ctx2d.lineTo(
    shapeInstance.viewLeftX + AREA_CORNER_HALF_SIDE,
    shapeInstance.viewBottomY
  );

  // Left Side Line
  shapeInstance.ctx2d.moveTo(
    shapeInstance.viewLeftX,
    shapeInstance.viewBottomY - AREA_CORNER_HALF_SIDE
  );
  shapeInstance.ctx2d.lineTo(
    shapeInstance.viewLeftX,
    shapeInstance.viewTopY + AREA_CORNER_HALF_SIDE
  );

  shapeInstance.ctx2d.stroke();
  shapeInstance.ctx2d.closePath();
}
