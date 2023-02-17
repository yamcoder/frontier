import { filter, fromEvent, switchMap, tap } from "rxjs";
import type { BoardContext } from "../context/context";

const selectHandler = (context: BoardContext) => {
  if (!context.state.isHoverShapeControlBoundary) {
    let selectedShapeId: number = 0;

    context.nodes.forEach(element => {
      if (element.id === context.state.hoveredShapeId) {
        element.setIsSelected(true);
        selectedShapeId = element.id;
      } else {
        element.setIsSelected(false);
      }
    });
    context.state.selectedShapeId = selectedShapeId;

    context.checkHovers();
    context.draw();
    context.stateChanges$.next(true);
    context.idbService.setState(context.state, 'boardState');
    context.idbService.setState(context.nodes.map(({ context, ...rest }) => rest), 'nodes');
  }
};

export const shapeSelect$ = (context: BoardContext) => {
  const pointerDown$ = fromEvent<PointerEvent>(context.canvas, 'pointerdown');
  const pointerUp$ = fromEvent<PointerEvent>(context.canvas, 'pointerup');

  return pointerDown$.pipe(
    filter(start => start.button === 0),
    tap(() => {
      if (!context.state.isHoverShapeControlArea) {
        selectHandler(context);
      }
    }),
    switchMap(event =>
      pointerUp$.pipe(
        tap(event => {
          if (!(context.state.isDragging || context.state.isSizing)) {
            selectHandler(context);
          }
        })
      )
    )
  );
}
