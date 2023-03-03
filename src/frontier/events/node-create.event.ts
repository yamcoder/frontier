import { fromEvent, filter, tap, map, switchMap, takeUntil } from "rxjs";
import { v4 as uuid } from "uuid";
import { POINTER_LEFT_BUTTON } from "../constants/event.constants";
import type { SceneContext } from "../core/scene-context";
import { getRandomColor } from "../helpers/get-random-color";

export const nodeCreate$ = (context: SceneContext) => {
  const pointerDown$ = fromEvent<PointerEvent>(context.canvas, 'pointerdown');
  const pointerMove$ = fromEvent<PointerEvent>(context.canvas, 'pointermove');
  const pointerUp$ = fromEvent<PointerEvent>(context.canvas, 'pointerup');

  return pointerDown$.pipe(
    filter(() => context.scene.creatableNodeType !== null),
    filter(start => start.button === POINTER_LEFT_BUTTON),
    tap(start => {
      context.canvas.setPointerCapture(start.pointerId);
    }),
    map(start => {
      const id = uuid();

      context.addNode({
        type: context.scene.creatableNodeType as any,
        id,
        x: context.scene.pointerX,
        y: context.scene.pointerY,
        width: 100,
        height: 100,
        fillColor: getRandomColor()
      });

      const node = context.nodes.find(node => node.id === id)!;
      context.scene.selectedNodeId = id;
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
          context.scene.isNodeCreating = true;
          context.checkHovers();
          context.draw();
          context.changeState();
        }),
        takeUntil(pointerUp$.pipe(
          tap(() => {

            if (context.scene.isNodeCreating === false) {
              start.node.setX(start.node.x - 50);
              start.node.setY(start.node.y - 50);
            }

            context.scene.isNodeCreating = false;
            context.scene.creatableNodeType = null;
            context.canvas.style.cursor = 'default';
            context.checkHovers();
            context.draw();
            context.changeState();
            context.idbService.setNodes(context.nodes);
          })
        ))
      )),
  );
}
