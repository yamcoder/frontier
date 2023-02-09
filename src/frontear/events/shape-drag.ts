import { fromEvent, filter, tap, map, switchMap, takeUntil } from "rxjs";
import type { BoardContext } from "../core/board";
import type { Shape } from "../shapes/abstract-shape";

export const shapeDrag$ = (context: BoardContext) => {
  const pointerDown$ = fromEvent<PointerEvent>(context.canvas, 'pointerdown');
  const pointerMove$ = fromEvent<PointerEvent>(context.canvas, 'pointermove');
  const pointerUp$ = fromEvent<PointerEvent>(context.canvas, 'pointerup');

  return pointerDown$.pipe(
    filter(start => start.button === 0),
    filter(start => context.state.isHoverShapeControlArea || context.state.hoveredShapeId !== 0),
    tap(start => {
      context.canvas.setPointerCapture(start.pointerId);
    }),
    map(start => {
      let draggableShape: Shape;

      if (context.state.isHoverShapeControlArea) {
        draggableShape = context.layer.shapes.find(el => el.id === context.state.selectedShapeId)!;
      } else {
        draggableShape = context.layer.shapes.find(el => el.id === context.state.hoveredShapeId)!;
      }

      return {
        originalEvent: start,
        offsetX: start.clientX - (start.target as HTMLCanvasElement).offsetLeft,
        offsetY: start.clientY - (start.target as HTMLCanvasElement).offsetTop,
        deltaX: 0,
        deltaY: 0,
        draggableShape: {
          shape: draggableShape,
          startX: draggableShape.x,
          startY: draggableShape.y,
        },
      }
    }),
    switchMap(start =>
      pointerMove$.pipe(
        map(move => {
          const deltaX = move.clientX - start.originalEvent.clientX;
          const deltaY = move.clientY - start.originalEvent.clientY;

          if (context.state.isHoverShapeControlArea) {
            context.state.isDragging = true;
          }

          return ({
            originalEvent: move,
            offsetX: move.clientX - (move.target as HTMLCanvasElement).offsetLeft,
            offsetY: move.clientY - (move.target as HTMLCanvasElement).offsetTop,
            deltaX,
            deltaY,
          })
        }),
        tap(move => {
          start.draggableShape.shape.setX(start.draggableShape.startX + Math.round(move.deltaX / context.state.scale));
          start.draggableShape.shape.setY(start.draggableShape.startY + Math.round(move.deltaY / context.state.scale));

          context.layer.draw();
          context.stateChanges$.next(true);
        }),
        takeUntil(pointerUp$.pipe(
          tap(() => {
            context.state.isDragging = false;
          })
        ))
      )),
  );
}
