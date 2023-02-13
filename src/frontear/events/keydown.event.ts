import { fromEvent, map, tap } from "rxjs";
import type { BoardContext } from "../core/board";

export const keyDown$ = (context: BoardContext) => {
  const keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');

  return keyDown$.pipe(
    tap(event => {
      if (context.state.selectedShapeId !== 0) {

        if (!event.ctrlKey && event.code === 'BracketLeft') {
          context.layer.moveSelectedToBack();
        }

        if (!event.ctrlKey && event.code === 'BracketRight') {
          context.layer.moveSelectedToFront();
        }

        if (event.ctrlKey && event.code === 'BracketLeft') {
          context.layer.moveSelectedToBackByOne();
        }

        if (event.ctrlKey && event.code === 'BracketRight') {
          context.layer.moveSelectedToFrontByOne();
        }

        context.layer.draw();
        context.stateChanges$.next(true);
      }
    })
  );
}
