import { BehaviorSubject, filter, fromEvent, map, Subject, switchMap, takeUntil, tap } from "rxjs";
import { pointerDown, pointerMove, pointerUp } from "./events";
import type { BoardMoveEvent } from "./events";
import { Layer } from "./layer";

export class Board {
  #_canvas = document.createElement('canvas');
  #_ctx = this.#_canvas.getContext('2d')!;
  layer: Layer;

  scale = 1;
  viewportCorner: [number, number] = [1000, 1000];
  pointer: [number, number] = [0, 0];
  offset: [number, number] = [0, 0];

  #_stateChange$ = new Subject();
  stateChange$ = this.#_stateChange$.asObservable();

  constructor() {
    this.layer = new Layer(this.#_ctx, this);
    this.#_pointerMove$.subscribe();
    this.#_boardMove$.subscribe();
    this.#_boardZoom$.subscribe();
  }

  get #_pointerMove$() {
    const pointerMove$ = fromEvent<PointerEvent>(this.#_canvas, 'pointermove');

    return pointerMove$.pipe(
      tap(event => {
        this.#_canvas.setPointerCapture(event.pointerId);
      }),
      map(move => ({
        originalEvent: move,
        offsetX: move.clientX - (move.target as HTMLCanvasElement).offsetLeft,
        offsetY: move.clientY - (move.target as HTMLCanvasElement).offsetTop,
      })),
      tap(event => {
        this.offset = [event.offsetX, event.offsetY];
        this.pointer = [
          Math.round(this.viewportCorner[0] + (event.offsetX / this.scale)),
          Math.round(this.viewportCorner[1] + (event.offsetY / this.scale))
        ] as [number, number];
        this.layer.elements.forEach(element => {
          element.checkHover(this.pointer);
        });
        const topHoverIndex = this.layer.elements.lastIndexOf((element: any) => element.hover);

        this.#_boardDraw();
        this.#_stateChange$.next(true);
      })
    );
  }

  get #_boardMove$() {
    const pointerDown$ = fromEvent<PointerEvent>(this.#_canvas, 'pointerdown');
    const pointerMove$ = fromEvent<PointerEvent>(this.#_canvas, 'pointermove');
    const pointerUp$ = fromEvent<PointerEvent>(this.#_canvas, 'pointerup');
    // const pointerMove$ = pointerMove(this.#_canvas);
    // const pointerUp$ = pointerUp(this.#_canvas);

    return pointerDown$.pipe(
      filter(start => start.button === 1),
      tap(start => {
        this.#_canvas.setPointerCapture(start.pointerId);
      }),
      map(start => ({
        originalEvent: start,
        offsetX: start.clientX - (start.target as HTMLCanvasElement).offsetLeft,
        offsetY: start.clientY - (start.target as HTMLCanvasElement).offsetTop,
        deltaX: 0,
        deltaY: 0,
        viewportCorner: this.viewportCorner
      })),
      switchMap(start =>
        pointerMove$.pipe(
          map(move => {
            const deltaX = move.clientX - start.originalEvent.clientX;
            const deltaY = move.clientY - start.originalEvent.clientY;

            return ({
              originalEvent: move,
              offsetX: move.clientX - (move.target as HTMLCanvasElement).offsetLeft,
              offsetY: move.clientY - (move.target as HTMLCanvasElement).offsetTop,
              deltaX,
              deltaY,
              viewportCorner: [
                start.viewportCorner[0] - Math.round(deltaX / this.scale),
                start.viewportCorner[1] - Math.round(deltaY / this.scale)
              ] as [number, number]
            })
          }),
          tap(move => {
            this.#_changeCorner(move.viewportCorner);
            this.#_boardDraw();
            this.#_stateChange$.next(true);
          }),
          takeUntil(pointerUp$)
        )),
    );
  }

  get #_boardZoom$() {
    const wheel$ = fromEvent<WheelEvent>(this.#_canvas, 'wheel');

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
          newScale = this.scale + 0.2;
          this.scale = +newScale.toFixed(1);
        } else {
          newScale = this.scale - 0.2;
          newScale = newScale < 0.2 ? 0.2 : newScale;
          this.scale = +newScale.toFixed(1);
        }
        this.#_changeCorner([
          this.pointer[0] - Math.round(this.offset[0] / newScale),
          this.pointer[1] - Math.round(this.offset[1] / newScale),
        ]);
        this.#_boardDraw();
        this.#_stateChange$.next(true);
      })
    )
  }

  mount(element: HTMLElement): void {
    this.#_canvas.style.display = 'block';
    this.#_onBoardResize(element);
    this.#_canvas.width = element.clientWidth;
    this.#_canvas.height = element.clientHeight;
    this.#_boardDraw();
    element.append(this.#_canvas);
  }

  #_changeCorner(viewportCorner: [number, number]) {
    this.viewportCorner = viewportCorner;
  }

  #_onBoardResize(element: HTMLElement): void {
    const resizer = new ResizeObserver(([entry]) => {
      this.#_canvas.width = entry.contentRect.width;
      this.#_canvas.height = entry.contentRect.height;
      this.#_boardDraw();
    });
    resizer.observe(element);
  }

  #_boardDraw() {
    this.#_ctx.clearRect(0, 0, this.#_canvas.width, this.#_canvas.height);
    this.#_ctx.fillStyle = '#F5F5F5';
    this.#_ctx.fillRect(0, 0, this.#_ctx.canvas.width, this.#_ctx.canvas.height);
    this.layer.draw();
  }
}
