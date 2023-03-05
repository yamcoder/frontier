import { fromEvent, map, tap } from "rxjs";
import type { SceneContext } from "../core/scene-context";
import { NodeType } from "../nodes/node-factory";

export const keyDown$ = (context: SceneContext) => {
  const keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');

  return keyDown$.pipe(
    tap(event => {
      if (context.scene.selectedNodeId) {

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
        context.changeState();
        context.idbService.setNodes(context.nodes);
      }

      if (event.code === 'KeyR') {
        context.scene.setCreatableNodeType(NodeType.Rectangle);
        context.cursorStyle('crosshair');
        context.changeState();
      }

      if (event.code === 'KeyE') {
        context.scene.setCreatableNodeType(NodeType.Ellipse);
        context.cursorStyle('crosshair');
        context.changeState();
      }
    })
  );
}
