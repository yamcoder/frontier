import { fromEvent, map, tap } from "rxjs";
import type { BoardContext } from "../context/context";

export const keyDown$ = (context: BoardContext) => {
  const keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');

  return keyDown$.pipe(
    tap(event => {
      if (context.state.selectedShapeId !== '') {

        if (event.code === 'Escape') {
          context.unselectAll();
        }

        if (event.code === 'Delete') {
          context.deleteSelected();
        }

        if (!event.ctrlKey && event.code === 'BracketLeft') {
          context.moveSelectedToBack();
        }

        if (!event.ctrlKey && event.code === 'BracketRight') {
          context.moveSelectedToFront();
        }

        if (event.ctrlKey && event.code === 'BracketLeft') {
          context.moveSelectedToBackByOne();
        }

        if (event.ctrlKey && event.code === 'BracketRight') {
          context.moveSelectedToFrontByOne();
        }

        context.draw();
        context.stateChanges$.next(true);
        context.idbService.setState(context.nodes.map(({ context, ...rest }) => rest), 'nodes');
      }
    })
  );
}
