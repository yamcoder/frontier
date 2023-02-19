import { fromEvent, filter, tap, map, switchMap, takeUntil } from "rxjs";
import { v4 as uuid } from "uuid";
import type { BoardContext } from "../context/context";
import { getRandomColor } from "../helpers/get-random-color";
import type { Shape } from "../shapes/abstract-shape";

export const nodeCreate$ = (context: BoardContext) => {
  const pointerDown$ = fromEvent<PointerEvent>(context.canvas, 'pointerdown');
  const pointerMove$ = fromEvent<PointerEvent>(context.canvas, 'pointermove');
  const pointerUp$ = fromEvent<PointerEvent>(context.canvas, 'pointerup');

  return pointerDown$.pipe(
    filter(() => context.state.beingCreatedNode !== null),
    filter(start => start.button === 0),
    tap(start => {
      context.canvas.setPointerCapture(start.pointerId);
    }),
    map(start => {
      const id = uuid();

      context.addShape({
        type: context.state.beingCreatedNode as any,
        id,
        x: context.state.pointerX,
        y: context.state.pointerY,
        width: 100,
        height: 100,
        fillColor: getRandomColor()
      });

      const node = context.nodes.find(node => node.id === id)!;
      context.state.selectedShapeId = id;
      node.setIsSelected(true);
      context.checkHovers();

      return {
        originalEvent: start,
        offsetX: start.clientX - (start.target as HTMLCanvasElement).offsetLeft,
        offsetY: start.clientY - (start.target as HTMLCanvasElement).offsetTop,
        deltaX: 0,
        deltaY: 0,
        node
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
          context.state.isCreating = true;
          context.checkHovers();
          context.draw();
          context.stateChanges$.next(true);
        }),
        takeUntil(pointerUp$.pipe(
          tap(() => {

            if (context.state.isCreating === false) {
              start.node.setX(start.node.x - 50);
              start.node.setY(start.node.y - 50);
            }

            context.state.isCreating = false;
            context.state.beingCreatedNode = null;
            context.canvas.style.cursor = 'default';
            context.checkHovers();
            context.draw();
            context.stateChanges$.next(true);
            context.idbService.setState(context.nodes.map(({ context, ...rest }) => rest), 'nodes');
          })
        ))
      )),
  );
}
