import { fromEvent, filter, tap, map, switchMap, takeUntil } from "rxjs";
import { POINTER_LEFT_BUTTON } from "../constants/event.constants";
import type { SceneContext } from "../core/scene-context";
import type { Node } from "../nodes/abstract-node";

export const nodeDrag$ = (context: SceneContext) => {
  const pointerDown$ = fromEvent<PointerEvent>(context.canvas, 'pointerdown');
  const pointerMove$ = fromEvent<PointerEvent>(context.canvas, 'pointermove');
  const pointerUp$ = fromEvent<PointerEvent>(context.canvas, 'pointerup');

  return pointerDown$.pipe(
    filter(start => start.button === POINTER_LEFT_BUTTON),
    filter(() => !context.scene.isHoverResizeControls),
    filter(() => context.scene.isHoverSelectedNodeArea || context.scene.hoveredNodeId !== null),
    tap(start => {
      context.canvas.setPointerCapture(start.pointerId);
    }),
    map(start => {
      let draggableNode: Node;

      if (context.scene.isHoverSelectedNodeArea) {
        draggableNode = context.nodes.find(node => node.id === context.scene.selectedNodeId)!;
      } else {
        draggableNode = context.nodes.find(node => node.id === context.scene.hoveredNodeId)!;
      }

      return {
        originalEvent: start,
        offsetX: start.clientX - (start.target as HTMLCanvasElement).offsetLeft,
        offsetY: start.clientY - (start.target as HTMLCanvasElement).offsetTop,
        deltaX: 0,
        deltaY: 0,
        draggableNode: {
          node: draggableNode,
          startX: draggableNode.x,
          startY: draggableNode.y,
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
          context.scene.isNodeDragging = true;

          start.draggableNode.node.setX(start.draggableNode.startX + Math.round(move.deltaX / context.scene.scale));
          start.draggableNode.node.setY(start.draggableNode.startY + Math.round(move.deltaY / context.scene.scale));

          context.draw();
          context.changeState();
        }),
        takeUntil(pointerUp$.pipe(
          tap(() => {
            context.scene.isNodeDragging = false;
            context.idbService.setNodes(context.nodes);
          })
        ))
      )),
  );
}
