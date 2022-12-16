import { fromEvent, map, tap } from "rxjs";

export interface BoardMoveEvent {
  originalEvent: PointerEvent;
  offsetX: number;
  offsetY: number;
  deltaX: number;
  deltaY: number;
  viewportCorner: [number, number];
};

const computeOffsetX = (event: PointerEvent) => {
  return event.clientX - (event.target as HTMLCanvasElement).offsetLeft;
};

const computeOffsetY = (event: PointerEvent) => {
  return event.clientY - (event.target as HTMLCanvasElement).offsetTop;
};

const offsetMapper = (event: PointerEvent): BoardMoveEvent => ({
  originalEvent: event,
  offsetX: computeOffsetX(event),
  offsetY: computeOffsetY(event),
  deltaX: 0,
  deltaY: 0,
  viewportCorner: [0, 0]
});

export const pointerDown = (element: HTMLCanvasElement) =>
  fromEvent<PointerEvent>(element, "pointerdown")
    .pipe(map(offsetMapper));

export const pointerMove = (element: HTMLCanvasElement) =>
  fromEvent<PointerEvent>(element, "pointermove")
    .pipe(map(offsetMapper));

export const pointerUp = (element: HTMLCanvasElement) =>
  fromEvent<PointerEvent>(element, "pointerup")
    .pipe(map(offsetMapper));
