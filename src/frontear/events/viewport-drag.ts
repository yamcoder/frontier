import { filter, fromEvent, map, switchMap, takeUntil, tap } from "rxjs";
import type { BoardContext } from "../core/board-core";

export const viewportDrag$ = (context: BoardContext) => {
  const pointerDown$ = fromEvent<PointerEvent>(context.canvas, 'pointerdown');
  const pointerMove$ = fromEvent<PointerEvent>(context.canvas, 'pointermove');
  const pointerUp$ = fromEvent<PointerEvent>(context.canvas, 'pointerup');

  return pointerDown$.pipe(
    filter(start => start.button === 1),
    tap(start => {
      context.canvas.setPointerCapture(start.pointerId);
      context.canvas.style.cursor = 'grabbing';
    }),
    map(start => ({
      originalEvent: start,
      offsetX: start.clientX - (start.target as HTMLCanvasElement).offsetLeft,
      offsetY: start.clientY - (start.target as HTMLCanvasElement).offsetTop,
      deltaX: 0,
      deltaY: 0,
      viewportX: context.state.viewportX,
      viewportY: context.state.viewportY
    })),
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
            viewportX: start.viewportX - Math.round(deltaX / context.state.scale),
            viewportY: start.viewportY - Math.round(deltaY / context.state.scale),
          })
        }),
        tap(move => {
          context.state.viewportX = move.viewportX;
          context.state.viewportY = move.viewportY;
          context.layer.draw();
          context.stateChanges$.next(true);
        }),
        takeUntil(pointerUp$.pipe(
          tap(() => {
            context.canvas.style.cursor = 'default';
          })))
      )),
  );
}
