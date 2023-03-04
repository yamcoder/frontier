import { filter, fromEvent, switchMap, tap } from "rxjs";
import { POINTER_LEFT_BUTTON } from "../constants/event.constants";
import type { SceneContext } from "../core/scene-context";

const selectHandler = (context: SceneContext) => {
  if (!context.scene.isHoverResizeControls) {
    let selectedNodeId: string | null = null;

    context.nodes.forEach(element => {
      if (element.id === context.scene.hoveredNodeId) {
        element.setIsSelected(true);
        selectedNodeId = element.id;
      } else {
        element.setIsSelected(false);
      }
    });
    context.scene.setSelectedNodeId(selectedNodeId);

    context.checkHovers();
    context.draw();
    context.changeState();
    context.idbService.setScene(context.scene);
    context.idbService.setNodes(context.nodes);
  }
};

export const nodeSelect$ = (context: SceneContext) => {
  const pointerDown$ = fromEvent<PointerEvent>(context.canvas, 'pointerdown');
  const pointerUp$ = fromEvent<PointerEvent>(context.canvas, 'pointerup');

  return pointerDown$.pipe(
    filter(start => start.button === POINTER_LEFT_BUTTON),
    tap(() => {
      if (!context.scene.isHoverSelectedNodeArea) {
        selectHandler(context);
      }
    }),
    switchMap(event =>
      pointerUp$.pipe(
        tap(event => {
          if (!(context.scene.isNodeDragging || context.scene.isNodeResizing)) {
            selectHandler(context);
          }
        })
      )
    )
  );
}
