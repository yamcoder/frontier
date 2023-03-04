import { fromEvent, filter, tap, map } from "rxjs";
import type { SceneContext } from "../core/scene-context";

export const viewportZoom$ = (context: SceneContext) => {
  const wheel$ = fromEvent<WheelEvent>(context.canvas, 'wheel', { passive: false });

  return wheel$.pipe(
    filter(wheel => wheel.ctrlKey),
    tap(wheel => wheel.preventDefault()),
    map(wheel => ({
      originalEvent: wheel,
      zoom: wheel.deltaY > 0 ? 'ZOOM_IN' : 'ZOOM_OUT'
    })),
    tap(event => {
      let newScale: number;
      if (event.zoom === 'ZOOM_OUT') {
        newScale = context.scene.scale + 0.2;
        context.scene.setScale(+newScale.toFixed(1));
      } else {
        newScale = context.scene.scale - 0.2;
        newScale = newScale < 0.2 ? 0.2 : newScale;
        context.scene.setScale(+newScale.toFixed(1));
      }
      context.scene.setViewportX(context.scene.pointerX - Math.round(context.scene.offsetX / newScale));
      context.scene.setViewportY(context.scene.pointerY - Math.round(context.scene.offsetY / newScale));
      context.draw();
      context.changeState();
      context.idbService.setScene(context.scene);
    })
  )
}
