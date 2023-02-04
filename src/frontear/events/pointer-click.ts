import { filter, fromEvent, tap } from "rxjs";
import type { BoardContext } from "../core/board-core";

export const pointerClick$ = (context: BoardContext) => {
  const pointerDown$ = fromEvent<PointerEvent>(context.canvas, 'pointerdown');

  return pointerDown$.pipe(
    filter(start => start.button === 0),
    tap(() => {
      let selectedElementId: number = 0;

      context.layer.shapes.forEach(element => {
        if (element.id === context.state.hoverElementId) {
          element.setIsSelected(true);
          selectedElementId = element.id;
        } else {
          element.setIsSelected(false);
        }
      });

      context.state.selectedElementId = selectedElementId;
      context.layer.draw();
      context.stateChanges$.next(true);
    })
  );
}
