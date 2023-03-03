import { fromEvent, map, tap } from "rxjs";
import type { SceneContext } from "../core/scene-context";

export const pointerMove$ = (context: SceneContext) => {
  const pointerMove$ = fromEvent<PointerEvent>(context.canvas, 'pointermove');

  return pointerMove$.pipe(
    tap(event => {
      context.canvas.setPointerCapture(event.pointerId);
    }),
    map(move => ({
      originalEvent: move,
      offsetX: move.clientX - (move.target as HTMLCanvasElement).offsetLeft,
      offsetY: move.clientY - (move.target as HTMLCanvasElement).offsetTop,
    })),
    tap(event => {
      context.scene.offsetX = Math.round(event.offsetX);
      context.scene.offsetY = Math.round(event.offsetY);
      context.scene.pointerX = Math.round(context.scene.viewportX + (event.offsetX / context.scene.scale));
      context.scene.pointerY = Math.round(context.scene.viewportY + (event.offsetY / context.scene.scale));

      context.checkHovers();
      context.draw();
      context.changeState();
    })
  );
}
