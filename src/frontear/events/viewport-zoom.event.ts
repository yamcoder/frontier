import { fromEvent, filter, tap, map } from "rxjs";
import type { BoardContext } from "../core/board";

export const viewportZoom$ = (context: BoardContext) => {
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
        newScale = context.state.scale + 0.2;
        context.state.scale = +newScale.toFixed(1);
      } else {
        newScale = context.state.scale - 0.2;
        newScale = newScale < 0.2 ? 0.2 : newScale;
        context.state.scale = +newScale.toFixed(1);
      }
      context.state.viewportX = context.state.pointerX - Math.round(context.state.offsetX / newScale);
      context.state.viewportY = context.state.pointerY - Math.round(context.state.offsetY / newScale);
      context.layer.draw();
      context.stateChanges$.next(true);
    })
  )
}
