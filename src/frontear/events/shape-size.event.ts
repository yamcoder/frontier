import { fromEvent, filter, tap, map, switchMap, takeUntil } from "rxjs";
import type { BoardContext } from "../context/context";

export const shapeSize$ = (context: BoardContext) => {
  const pointerDown$ = fromEvent<PointerEvent>(context.canvas, 'pointerdown');
  const pointerMove$ = fromEvent<PointerEvent>(context.canvas, 'pointermove');
  const pointerUp$ = fromEvent<PointerEvent>(context.canvas, 'pointerup');

  return pointerDown$.pipe(
    filter(start => start.button === 0),
    filter(() => context.state.isHoverShapeControlBoundary),
    tap(start => {
      context.canvas.setPointerCapture(start.pointerId);
    }),
    map(start => {
      const target = context.nodes.find(el => el.id === context.state.selectedShapeId)!;
      // let controlType: 'T' | 'R' | 'B' | 'L' | 'LT' | 'RT' | 'LB' | 'RB' = '';
      let controlType = '';
      if (context.state.isHoverShapeControlR) controlType = 'R';
      if (context.state.isHoverShapeControlB) controlType = 'B';
      if (context.state.isHoverShapeControlRB) controlType = 'RB';

      return {
        originalEvent: start,
        offsetX: start.clientX - (start.target as HTMLCanvasElement).offsetLeft,
        offsetY: start.clientY - (start.target as HTMLCanvasElement).offsetTop,
        deltaX: 0,
        deltaY: 0,
        controlType,
        target: {
          shape: target,
          startWidth: target.width,
          startHeight: target.height,
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
          context.state.isSizing = true;

          switch (start.controlType) {
            case 'R': start.target.shape.setWidth(start.target.startWidth + Math.round(move.deltaX / context.state.scale)); break;
            case 'B': start.target.shape.setHeight(start.target.startHeight + Math.round(move.deltaY / context.state.scale)); break;
            case 'RB': {
              start.target.shape.setWidth(start.target.startWidth + Math.round(move.deltaX / context.state.scale));
              start.target.shape.setHeight(start.target.startHeight + Math.round(move.deltaY / context.state.scale));
              break;
            }
            default:
              break;
          }

          context.draw();
          context.stateChanges$.next(true);
        }),
        takeUntil(pointerUp$.pipe(
          tap(() => {
            context.state.isSizing = false;
            context.stateChanges$.next(true);
            context.idbService.setState(context.nodes.map(({ context, ...rest }) => rest), 'nodes');
          })
        ))
      )),
  );
}
