import { fromEvent, filter, tap, map, switchMap, takeUntil } from "rxjs";
import { POINTER_LEFT_BUTTON } from "../constants/event.constants";
import type { SceneContext } from "../core/scene-context";

export const nodeResize$ = (context: SceneContext) => {
  const pointerDown$ = fromEvent<PointerEvent>(context.canvas, 'pointerdown');
  const pointerMove$ = fromEvent<PointerEvent>(context.canvas, 'pointermove');
  const pointerUp$ = fromEvent<PointerEvent>(context.canvas, 'pointerup');

  return pointerDown$.pipe(
    filter(start => start.button === POINTER_LEFT_BUTTON),
    filter(() => context.scene.isHoverResizeControls),
    tap(start => {
      context.canvas.setPointerCapture(start.pointerId);
    }),
    map(start => {
      const target = context.nodes.find(el => el.id === context.scene.selectedNodeId)!;
      let resizeControl: 'NW' | 'NE' | 'SE' | 'SW' | 'N' | 'E' | 'S' | 'W' | null = null;
      if (context.scene.isHoverResizeControl.NW) resizeControl = 'NW';
      if (context.scene.isHoverResizeControl.NE) resizeControl = 'NE';
      if (context.scene.isHoverResizeControl.SE) resizeControl = 'SE';
      if (context.scene.isHoverResizeControl.SW) resizeControl = 'SW';
      if (context.scene.isHoverResizeControl.N) resizeControl = 'N';
      if (context.scene.isHoverResizeControl.E) resizeControl = 'E';
      if (context.scene.isHoverResizeControl.S) resizeControl = 'S';
      if (context.scene.isHoverResizeControl.W) resizeControl = 'W';

      return {
        originalEvent: start,
        offsetX: start.clientX - (start.target as HTMLCanvasElement).offsetLeft,
        offsetY: start.clientY - (start.target as HTMLCanvasElement).offsetTop,
        deltaX: 0,
        deltaY: 0,
        resizeControl,
        target: {
          node: target,
          startX: target.x,
          startY: target.y,
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
          context.scene.isNodeResizing = true;

          switch (start.resizeControl) {
            case 'E': {
              start.target.node.setWidth(start.target.startWidth + Math.round(move.deltaX / context.scene.scale));
              break;
            }
            case 'S': {
              start.target.node.setHeight(start.target.startHeight + Math.round(move.deltaY / context.scene.scale));
              break;
            }
            case 'W': {
              start.target.node.setX(start.target.startX + Math.round(move.deltaX / context.scene.scale));
              start.target.node.setWidth(start.target.startWidth - Math.round(move.deltaX / context.scene.scale));
              break;
            }
            case 'N': {
              start.target.node.setY(start.target.startY + Math.round(move.deltaY / context.scene.scale));
              start.target.node.setHeight(start.target.startHeight - Math.round(move.deltaY / context.scene.scale));
              break;
            }
            case 'SE': {
              start.target.node.setWidth(start.target.startWidth + Math.round(move.deltaX / context.scene.scale));
              start.target.node.setHeight(start.target.startHeight + Math.round(move.deltaY / context.scene.scale));
              break;
            }
            case 'NW': {
              start.target.node.setX(start.target.startX + Math.round(move.deltaX / context.scene.scale));
              start.target.node.setY(start.target.startY + Math.round(move.deltaY / context.scene.scale));
              start.target.node.setWidth(start.target.startWidth - Math.round(move.deltaX / context.scene.scale));
              start.target.node.setHeight(start.target.startHeight - Math.round(move.deltaY / context.scene.scale));
              break;
            }
            case 'NE': {
              start.target.node.setY(start.target.startY + Math.round(move.deltaY / context.scene.scale));
              start.target.node.setHeight(start.target.startHeight - Math.round(move.deltaY / context.scene.scale));
              start.target.node.setWidth(start.target.startWidth + Math.round(move.deltaX / context.scene.scale));
              break;
            }
            case 'SW': {
              start.target.node.setX(start.target.startX + Math.round(move.deltaX / context.scene.scale));
              start.target.node.setWidth(start.target.startWidth - Math.round(move.deltaX / context.scene.scale));
              start.target.node.setHeight(start.target.startHeight + Math.round(move.deltaY / context.scene.scale));
              break;
            }
            default:
              break;
          }

          context.draw();
          context.changeState();
        }),
        takeUntil(pointerUp$.pipe(
          tap(() => {
            context.scene.isNodeResizing = false;
            context.changeState();
            context.idbService.setNodes(context.nodes);
          })
        ))
      )),
  );
}
