import { Subject } from "rxjs";
import { COLOR_BOARD_BACKGROUND } from "../constants/colors";
import { shapeSelect$ } from "../events/shape-select.event";
import { pointerMove$ } from "../events/pointer-move.event";
import { shapeDrag$ } from "../events/shape-drag.event";
import { viewportDrag$ } from "../events/viewport-drag.event";
import { viewportZoom$ } from "../events/viewport-zoom.event";
import { Layer } from "../layers/layer";
import { BoardState } from "./board-state";
import { shapeSize$ } from "../events/shape-size.event";

export type BoardContext = {
  canvas: HTMLCanvasElement;
  ctx2d: CanvasRenderingContext2D;
  state: BoardState;
  stateChanges$: Subject<true>;
  layer: Layer;
}

export class Board {
  readonly #canvas = document.createElement('canvas');
  readonly #ctx2d = this.#canvas.getContext('2d')!;
  readonly #state = new BoardState();
  readonly #stateChanges$ = new Subject<true>();
  readonly #layer = new Layer(this.#canvas, this.#ctx2d, this.#state);

  readonly #context: BoardContext = {
    canvas: this.#canvas,
    ctx2d: this.#ctx2d,
    state: this.#state,
    stateChanges$: this.#stateChanges$,
    layer: this.#layer
  };

  stateChanges$ = this.#stateChanges$.asObservable();

  get state() {
    return this.#state;
  }

  get shapes() {
    return this.#layer.shapesList;
  }

  constructor() {
    pointerMove$(this.#context).subscribe();
    viewportDrag$(this.#context).subscribe();
    viewportZoom$(this.#context).subscribe();
    shapeSelect$(this.#context).subscribe();
    shapeDrag$(this.#context).subscribe();
    shapeSize$(this.#context).subscribe();
  }

  mount(element: HTMLElement): void {
    this.#canvas.style.display = 'block';
    this.#canvas.style.backgroundColor = COLOR_BOARD_BACKGROUND;
    this.#canvas.width = element.clientWidth;
    this.#canvas.height = element.clientHeight;
    this.observeResize(element);
    element.append(this.#canvas);
    this.draw();
  }

  private observeResize(element: HTMLElement): void {
    const resizer = new ResizeObserver(([entry]) => {
      this.#canvas.width = entry.contentRect.width;
      this.#canvas.height = entry.contentRect.height;
      this.draw();
    });
    resizer.observe(element);
  }

  private draw(): void {
    this.#layer.draw();
  }
}
