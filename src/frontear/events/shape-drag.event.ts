import { fromEvent, filter, tap, map, switchMap, takeUntil } from "rxjs";
import type { BoardContext } from "../context/context";
import type { Shape } from "../shapes/abstract-shape";

export const shapeDrag$ = (context: BoardContext) => {
  const pointerDown$ = fromEvent<PointerEvent>(context.canvas, 'pointerdown');
  const pointerMove$ = fromEvent<PointerEvent>(context.canvas, 'pointermove');
  const pointerUp$ = fromEvent<PointerEvent>(context.canvas, 'pointerup');

  return pointerDown$.pipe(
    filter(start => start.button === 0),
    filter(() => !context.state.isHoverShapeControlBoundary),
    filter(() => context.state.isHoverShapeControlArea || context.state.hoveredShapeId !== ''),
    tap(start => {
      context.canvas.setPointerCapture(start.pointerId);
    }),
    map(start => {
      let draggableShape: Shape;

      if (context.state.isHoverShapeControlArea) {
        draggableShape = context.nodes.find(el => el.id === context.state.selectedShapeId)!;
      } else {
        draggableShape = context.nodes.find(el => el.id === context.state.hoveredShapeId)!;
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
        map(move => ({
          originalEvent: move,
          offsetX: move.clientX - (move.target as HTMLCanvasElement).offsetLeft,
          offsetY: move.clientY - (move.target as HTMLCanvasElement).offsetTop,
          deltaX: move.clientX - start.originalEvent.clientX,
          deltaY: move.clientY - start.originalEvent.clientY,
        })),
        tap(move => {
          context.state.isDragging = true;

          start.draggableShape.shape.setX(start.draggableShape.startX + Math.round(move.deltaX / context.state.scale));
          start.draggableShape.shape.setY(start.draggableShape.startY + Math.round(move.deltaY / context.state.scale));

          context.draw();
          context.stateChanges$.next(true);
        }),
        takeUntil(pointerUp$.pipe(
          tap(() => {
            context.state.isDragging = false;
            context.idbService.setState(context.nodes.map(({ context, ...rest }) => rest), 'nodes');
          })
        ))
      )),
  );
}
