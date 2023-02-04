import { fromEvent, map, tap } from "rxjs";
import type { BoardContext } from "../core/board-core";

export const pointerMove$ = (context: BoardContext) => {
  const pointerMove$ = fromEvent<PointerEvent>(context.canvas, 'pointermove');

  return pointerMove$.pipe(
    tap(event => {
      context.canvas.setPointerCapture(event.pointerId);
    }),
    map(move => ({
      originalEvent: move,
      offsetX: move.clientX - (move.target as HTMLCanvasElement).offsetLeft,
      offsetY: move.clientY - (move.target as HTMLCanvasElement).offsetTop,
    })),
    tap(event => {
      context.state.offsetX = event.offsetX;
      context.state.offsetY = event.offsetY;
      context.state.pointerX = Math.round(context.state.viewportX + (event.offsetX / context.state.scale));
      context.state.pointerY = Math.round(context.state.viewportY + (event.offsetY / context.state.scale));

      context.layer.checkHovers();
      context.layer.draw();
      context.stateChanges$.next(true);
    })
  );
}
