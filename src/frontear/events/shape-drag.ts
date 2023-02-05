import { fromEvent, filter, tap, map, switchMap, takeUntil } from "rxjs";
import type { BoardContext } from "../core/board";

export const shapeDrag$ = (context: BoardContext) => {
  const pointerDown$ = fromEvent<PointerEvent>(context.canvas, 'pointerdown');
  const pointerMove$ = fromEvent<PointerEvent>(context.canvas, 'pointermove');
  const pointerUp$ = fromEvent<PointerEvent>(context.canvas, 'pointerup');

  return pointerDown$.pipe(
    filter(start => start.button === 0 && context.state.hoveredShapeId !== 0),
    tap(start => {
      context.canvas.setPointerCapture(start.pointerId);
    }),
    map(start => {
      const hoveredShape = context.layer.shapes.find(el => el.id === context.state.hoveredShapeId);

      return {
        originalEvent: start,
        offsetX: start.clientX - (start.target as HTMLCanvasElement).offsetLeft,
        offsetY: start.clientY - (start.target as HTMLCanvasElement).offsetTop,
        deltaX: 0,
        deltaY: 0,
        hoveredShape,
        hoveredShapeX: hoveredShape?.x || 0,
        hoveredShapeY: hoveredShape?.y || 0,
      }
    }),
    switchMap(start =>
      pointerMove$.pipe(
        map(move => {
          const deltaX = move.clientX - start.originalEvent.clientX;
          const deltaY = move.clientY - start.originalEvent.clientY;

          return ({
            originalEvent: move,
            offsetX: move.clientX - (move.target as HTMLCanvasElement).offsetLeft,
            offsetY: move.clientY - (move.target as HTMLCanvasElement).offsetTop,
            deltaX,
            deltaY,
          })
        }),
        tap(move => {
          start.hoveredShape?.setX(start.hoveredShapeX + Math.round(move.deltaX / context.state.scale));
          start.hoveredShape?.setY(start.hoveredShapeY + Math.round(move.deltaY / context.state.scale));

          context.layer.draw();
          context.stateChanges$.next(true);
        }),
        takeUntil(pointerUp$)
      )),
  );
}
