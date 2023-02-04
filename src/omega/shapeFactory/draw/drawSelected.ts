import { COLOR_BRAND } from "../../constants/colors";
import type { AbstractShape } from "../abstractShape";

export const drawSelectedFn = (shapeInstance: AbstractShape) => {
  const cornerHalfSize = 5;
  const cornerWidth = cornerHalfSize * 2;
  const cornerHeight = cornerHalfSize * 2;

  shapeInstance.ctx2d.beginPath();
  shapeInstance.ctx2d.strokeStyle = COLOR_BRAND;
  shapeInstance.ctx2d.lineWidth = 2;

  // ----------Corners----------
  // Left Top
  shapeInstance.ctx2d.rect(
    shapeInstance.viewLeftX - cornerHalfSize,
    shapeInstance.viewTopY - cornerHalfSize,
    cornerWidth,
    cornerHeight
  );

  // Right Top
  shapeInstance.ctx2d.rect(
    shapeInstance.viewRightX - cornerHalfSize,
    shapeInstance.viewTopY - cornerHalfSize,
    cornerWidth,
    cornerHeight
  );

  // Left Bottom
  shapeInstance.ctx2d.rect(
    shapeInstance.viewLeftX - cornerHalfSize,
    shapeInstance.viewBottomY - cornerHalfSize,
    cornerWidth,
    cornerHeight
  );

  // Right Bottom
  shapeInstance.ctx2d.rect(
    shapeInstance.viewRightX - cornerHalfSize,
    shapeInstance.viewBottomY - cornerHalfSize,
    cornerWidth,
    cornerHeight
  );

  // ----------Lines----------
  // Top
  shapeInstance.ctx2d.moveTo(
    shapeInstance.viewLeftX + cornerHalfSize,
    shapeInstance.viewTopY
  );
  shapeInstance.ctx2d.lineTo(
    shapeInstance.viewRightX - cornerHalfSize,
    shapeInstance.viewTopY
  );

  // Right
  shapeInstance.ctx2d.moveTo(
    shapeInstance.viewRightX,
    shapeInstance.viewTopY + cornerHalfSize
  );
  shapeInstance.ctx2d.lineTo(
    shapeInstance.viewRightX,
    shapeInstance.viewBottomY - cornerHalfSize
  );

  // Bottom
  shapeInstance.ctx2d.moveTo(
    shapeInstance.viewRightX - cornerHalfSize,
    shapeInstance.viewBottomY
  );
  shapeInstance.ctx2d.lineTo(
    shapeInstance.viewLeftX + cornerHalfSize,
    shapeInstance.viewBottomY
  );

  // Left
  shapeInstance.ctx2d.moveTo(
    shapeInstance.viewLeftX,
    shapeInstance.viewBottomY - cornerHalfSize
  );
  shapeInstance.ctx2d.lineTo(
    shapeInstance.viewLeftX,
    shapeInstance.viewTopY + cornerHalfSize
  );

  shapeInstance.ctx2d.stroke();
  shapeInstance.ctx2d.closePath();
}
