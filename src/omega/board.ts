import { BehaviorSubject, filter, fromEvent, map, Subject, switchMap, takeUntil, tap } from "rxjs";
import { pointerDown, pointerMove, pointerUp } from "./events";
import type { BoardMoveEvent } from "./events";
import { Layer } from "./layer";

export class Board {
  private canvas = document.createElement('canvas');
  ctx = this.canvas.getContext('2d')!;
  layer: Layer;

  scale = 1;
  viewportCorner: [number, number] = [1000, 1000];
  pointer: [number, number] = [0, 0];
  offset: [number, number] = [0, 0];
  hoverElementId: number = 0;
  selectedElement: any = null;

  _stateChange$ = new Subject();
  stateChange$ = this._stateChange$.asObservable();

  constructor() {
    this.layer = new Layer(this);

    this.pointerClick$().subscribe();
    this.pointerMove$().subscribe();
    this.dragViewport$().subscribe();
    this.zoomViewport$().subscribe();
    this.dragElement$().subscribe();
  }

  pointerMove$() {
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
        this.offset = [event.offsetX, event.offsetY];
        this.pointer = [
          Math.round(this.viewportCorner[0] + (event.offsetX / this.scale)),
          Math.round(this.viewportCorner[1] + (event.offsetY / this.scale))
        ] as [number, number];

        this.layer.elements.forEach(element => {
          element.checkHover(this.pointer);
        });

        for (let i = this.layer.elements.length - 1; i >= 0; i--) {
          const element = this.layer.elements[i];

          if (element.isHover) {
            this.hoverElementId = element.id;
            break;
          }

          this.hoverElementId = 0;
        }

        this.drawElements();
        // this.#_drawHoverOutline();
        this.drawSelectedOutline();
        this._stateChange$.next(true);
      })
    );
  }

  pointerClick$() {
    const pointerDown$ = fromEvent<PointerEvent>(this.canvas, 'pointerdown');

    return pointerDown$.pipe(
      filter(start => start.button === 0),
      tap(() => {
        let selectedElement: any = null;

        this.layer.elements.forEach(element => {
          if (element.id === this.hoverElementId) {
            element.setIsSelected(true);
            selectedElement = element;
          } else {
            element.setIsSelected(false);
          }
        });

        this.selectedElement = selectedElement;
        this.drawElements();
        this.drawSelectedOutline();
      }),
      tap(() => {
        this._stateChange$.next(true);
      })
    );
  }

  dragElement$() {
    const pointerDown$ = fromEvent<PointerEvent>(this.canvas, 'pointerdown');
    const pointerMove$ = fromEvent<PointerEvent>(this.canvas, 'pointermove');
    const pointerUp$ = fromEvent<PointerEvent>(this.canvas, 'pointerup');

    return pointerDown$.pipe(
      filter(start => start.button === 0 && this.hoverElementId !== 0),
      tap(start => {
        this.canvas.setPointerCapture(start.pointerId);
      }),
      map(start => {
        const hoverElement = this.layer.elements.find(el => el.id === this.hoverElementId);

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
              start.elementX + Math.round(move.deltaX / this.scale),
              start.elementY + Math.round(move.deltaY / this.scale),
            ]);

            this.drawElements();
            this.drawSelectedOutline();
            this._stateChange$.next(true);
          }),
          takeUntil(pointerUp$)
        )),
    );
  }

  dragViewport$() {
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
            this.changeCorner(move.viewportCorner);
            this.drawElements();
            this._stateChange$.next(true);
          }),
          takeUntil(pointerUp$)
        )),
    );
  }

  zoomViewport$() {
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
          newScale = this.scale + 0.2;
          this.scale = +newScale.toFixed(1);
        } else {
          newScale = this.scale - 0.2;
          newScale = newScale < 0.2 ? 0.2 : newScale;
          this.scale = +newScale.toFixed(1);
        }
        this.changeCorner([
          this.pointer[0] - Math.round(this.offset[0] / newScale),
          this.pointer[1] - Math.round(this.offset[1] / newScale),
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

  changeCorner(viewportCorner: [number, number]) {
    this.viewportCorner = viewportCorner;
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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#F5F5F5';
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.layer.draw();
  }

  drawHoverOutline() {
    this.layer.drawHover(this.hoverElementId);
  }

  drawSelectedOutline() {
    this.layer.drawSelected(this.selectedElement);
  }
}
