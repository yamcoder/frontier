import { filter, fromEvent, map, switchMap, takeUntil, tap } from "rxjs";
import { POINTER_MIDDLE_BUTTON } from "../constants/event.constants";
import type { SceneContext } from "../core/scene-context";

export const viewportDrag$ = (context: SceneContext) => {
  const pointerDown$ = fromEvent<PointerEvent>(context.canvas, 'pointerdown');
  const pointerMove$ = fromEvent<PointerEvent>(context.canvas, 'pointermove');
  const pointerUp$ = fromEvent<PointerEvent>(context.canvas, 'pointerup');

  return pointerDown$.pipe(
    filter(start => start.button === POINTER_MIDDLE_BUTTON),
    tap(start => {
      context.canvas.setPointerCapture(start.pointerId);
      context.scene.setIsViewportDragging(true);
      context.draw();
    }),
    map(start => ({
      originalEvent: start,
      offsetX: start.clientX - (start.target as HTMLCanvasElement).offsetLeft,
      offsetY: start.clientY - (start.target as HTMLCanvasElement).offsetTop,
      deltaX: 0,
      deltaY: 0,
      viewportX: context.scene.viewportX,
      viewportY: context.scene.viewportY
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
            viewportX: start.viewportX - Math.round(deltaX / context.scene.scale),
            viewportY: start.viewportY - Math.round(deltaY / context.scene.scale),
          })
        }),
        tap(move => {
          context.scene.setViewportX(move.viewportX);
          context.scene.setViewportY(move.viewportY);
          context.draw();
          context.changeState();
        }),
        takeUntil(pointerUp$.pipe(
          tap(() => {
            context.scene.setIsViewportDragging(false);
            context.idbService.setScene(context.scene);
          })))
      )),
  );
}
