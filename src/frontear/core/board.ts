import { COLOR_BOARD_BACKGROUND } from "../constants/colors";
import { shapeSelect$ } from "../events/shape-select.event";
import { pointerMove$ } from "../events/pointer-move.event";
import { shapeDrag$ } from "../events/shape-drag.event";
import { viewportDrag$ } from "../events/viewport-drag.event";
import { viewportZoom$ } from "../events/viewport-zoom.event";
import { BoardContext } from "../context/context";
import { shapeSize$ } from "../events/shape-size.event";
import { keyDown$ } from "../events/keydown.event";
import { nodeCreate$ } from "../events/node-create.event";

export class Board {
  readonly context: BoardContext;

  get state() {
    return this.context.state;
  }

  get shapes() {
    return this.context.shapesList;
  }

  constructor() {
    this.context = new BoardContext();

    keyDown$(this.context).subscribe();
    pointerMove$(this.context).subscribe();
    viewportDrag$(this.context).subscribe();
    viewportZoom$(this.context).subscribe();
    shapeSelect$(this.context).subscribe();
    shapeDrag$(this.context).subscribe();
    shapeSize$(this.context).subscribe();
    nodeCreate$(this.context).subscribe();

    this.context.idbService.getState('boardState')
      .then(state => {
        Object.assign(this.context.state, state);
        this.draw();
        this.context.stateChanges$.next(true);
      })
      .catch(console.error)
  }

  mount(element: HTMLElement): void {
    this.context.canvas.style.display = 'block';
    this.context.canvas.style.backgroundColor = COLOR_BOARD_BACKGROUND;
    this.context.canvas.width = element.clientWidth;
    this.context.canvas.height = element.clientHeight;
    this.observeResize(element);
    element.append(this.context.canvas);
    this.draw();
  }

  private observeResize(element: HTMLElement): void {
    const resizer = new ResizeObserver(([entry]) => {
      this.context.canvas.width = entry.contentRect.width;
      this.context.canvas.height = entry.contentRect.height;
      this.draw();
    });
    resizer.observe(element);
  }

  private draw(): void {
    this.context.draw();
  }
}
