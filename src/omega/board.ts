import { BehaviorSubject, filter, fromEvent, map, Subject, switchMap, takeUntil, tap } from "rxjs";
import { pointerDown, pointerMove, pointerUp } from "./events/events";
import type { BoardMoveEvent } from "./events/events";
import { Layer } from "./layers/layer";
import { BoardState } from "./boardState";

export class Board {
  private canvas = document.createElement('canvas');
  ctx2d = this.canvas.getContext('2d')!;
  state = new BoardState();
  layer: Layer;

  // scale = 1;
  // viewportCorner: [number, number] = [1000, 1000];
  // pointer: [number, number] = [0, 0];
  // offset: [number, number] = [0, 0];
  // hoverElementId: number = 0;
  // selectedElement: any = null;

  _stateChange$ = new Subject();
  stateChange$ = this._stateChange$.asObservable();

  constructor() {
    this.canvas.style.backgroundColor = '#F5F5F5';
    this.layer = new Layer(this.state, this.ctx2d);

    this.pointerClick$(this.state).subscribe();
    this.pointerMove$(this.state).subscribe();
    this.dragViewport$(this.state).subscribe();
    this.zoomViewport$(this.state).subscribe();
    this.dragElement$(this.state).subscribe();
  }

  pointerMove$(state: BoardState) {
    const pointerMove$ = fromEvent<PointerEvent>(this.canvas, 'pointermove');

    return pointerMove$.pipe(
      tap(event => {
        this.canvas.setPointerCapture(event.pointerId);
      }),
      map(move => ({
        originalEvent: move,
        offsetX: move.clientX - (move.target as HTMLCanvasElement).offsetLeft,
        offsetY: move.clientY - (move.target as HTMLCanvasElement).offsetTop,
      })),
      tap(event => {
        state.offset = [event.offsetX, event.offsetY];
        state.pointer = [
          Math.round(state.viewportCorner[0] + (event.offsetX / state.scale)),
          Math.round(state.viewportCorner[1] + (event.offsetY / state.scale))
        ] as [number, number];

        this.layer.elements.forEach(element => {
          element.checkHover(state.pointer);
        });

        for (let i = this.layer.elements.length - 1; i >= 0; i--) {
          const element = this.layer.elements[i];

          if (element.isHover) {
            state.hoverElementId = element.id;
            break;
          }

          state.hoverElementId = 0;
        }

        this.drawElements();
        this.drawHoverOutline();
        this.drawSelectedOutline();
        this._stateChange$.next(true);
      })
    );
  }

  pointerClick$(state: BoardState) {
    const pointerDown$ = fromEvent<PointerEvent>(this.canvas, 'pointerdown');

    return pointerDown$.pipe(
      filter(start => start.button === 0),
      tap(() => {
        let selectedElementId: number = 0;

        this.layer.elements.forEach(element => {
          if (element.id === state.hoverElementId) {
            element.setIsSelected(true);
            selectedElementId = element.id;
          } else {
            element.setIsSelected(false);
          }
        });

        state.selectedElementId = selectedElementId;
        this.drawElements();
        this.drawSelectedOutline();
      }),
      tap(() => {
        this._stateChange$.next(true);
      })
    );
  }

  dragElement$(state: BoardState) {
    const pointerDown$ = fromEvent<PointerEvent>(this.canvas, 'pointerdown');
    const pointerMove$ = fromEvent<PointerEvent>(this.canvas, 'pointermove');
    const pointerUp$ = fromEvent<PointerEvent>(this.canvas, 'pointerup');

    return pointerDown$.pipe(
      filter(start => start.button === 0 && state.hoverElementId !== 0),
      tap(start => {
        this.canvas.setPointerCapture(start.pointerId);
      }),
      map(start => {
        const hoverElement = this.layer.elements.find(el => el.id === state.hoverElementId);

        return {
          originalEvent: start,
          offsetX: start.clientX - (start.target as HTMLCanvasElement).offsetLeft,
          offsetY: start.clientY - (start.target as HTMLCanvasElement).offsetTop,
          deltaX: 0,
          deltaY: 0,
          element: hoverElement,
          elementX: hoverElement?.x || 0,
          elementY: hoverElement?.y || 0,
        }
      }),
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
            })
          }),
          tap(move => {
            start.element?.setXY([
              start.elementX + Math.round(move.deltaX / state.scale),
              start.elementY + Math.round(move.deltaY / state.scale),
            ]);

            this.drawElements();
            this.drawSelectedOutline();
            this._stateChange$.next(true);
          }),
          takeUntil(pointerUp$)
        )),
    );
  }

  dragViewport$(state: BoardState) {
    const pointerDown$ = fromEvent<PointerEvent>(this.canvas, 'pointerdown');
    const pointerMove$ = fromEvent<PointerEvent>(this.canvas, 'pointermove');
    const pointerUp$ = fromEvent<PointerEvent>(this.canvas, 'pointerup');

    return pointerDown$.pipe(
      filter(start => start.button === 1),
      tap(start => {
        this.canvas.setPointerCapture(start.pointerId);
      }),
      map(start => ({
        originalEvent: start,
        offsetX: start.clientX - (start.target as HTMLCanvasElement).offsetLeft,
        offsetY: start.clientY - (start.target as HTMLCanvasElement).offsetTop,
        deltaX: 0,
        deltaY: 0,
        viewportCorner: state.viewportCorner
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
                start.viewportCorner[0] - Math.round(deltaX / state.scale),
                start.viewportCorner[1] - Math.round(deltaY / state.scale)
              ] as [number, number]
            })
          }),
          tap(move => {
            this.changeCorner(state, move.viewportCorner);
            this.drawElements();
            this._stateChange$.next(true);
          }),
          takeUntil(pointerUp$)
        )),
    );
  }

  zoomViewport$(state: BoardState) {
    const wheel$ = fromEvent<WheelEvent>(this.canvas, 'wheel');

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
          newScale = state.scale + 0.2;
          state.scale = +newScale.toFixed(1);
        } else {
          newScale = state.scale - 0.2;
          newScale = newScale < 0.2 ? 0.2 : newScale;
          state.scale = +newScale.toFixed(1);
        }
        this.changeCorner(state, [
          state.pointer[0] - Math.round(state.offset[0] / newScale),
          state.pointer[1] - Math.round(state.offset[1] / newScale),
        ]);
        this.drawElements();
        this._stateChange$.next(true);
      })
    )
  }

  mount(element: HTMLElement): void {
    this.canvas.style.display = 'block';
    this.onBoardResize(element);
    this.canvas.width = element.clientWidth;
    this.canvas.height = element.clientHeight;
    this.drawElements();
    element.append(this.canvas);
  }

  changeCorner(state: BoardState, viewportCorner: [number, number]) {
    state.viewportCorner = viewportCorner;
  }

  onBoardResize(element: HTMLElement): void {
    const resizer = new ResizeObserver(([entry]) => {
      this.canvas.width = entry.contentRect.width;
      this.canvas.height = entry.contentRect.height;
      this.drawElements();
    });
    resizer.observe(element);
  }

  drawElements() {
    this.ctx2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.layer.draw();
  }

  drawHoverOutline() {
    this.layer.drawHover();
  }

  drawSelectedOutline() {
    this.layer.drawSelected();
  }
}
