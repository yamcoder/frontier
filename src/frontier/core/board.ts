import { COLOR_BOARD_BACKGROUND } from "../constants/color.constants";
import { nodeSelect$ } from "../events/node-select.event";
import { pointerMove$ } from "../events/pointer-move.event";
import { nodeDrag$ } from "../events/node-drag.event";
import { viewportDrag$ } from "../events/viewport-drag.event";
import { viewportZoom$ } from "../events/viewport-zoom.event";
import { SceneContext } from "./scene-context";
import { nodeResize$ } from "../events/node-resize.event";
import { keyDown$ } from "../events/keydown.event";
import { nodeCreate$ } from "../events/node-create.event";
import type { NodeType } from "./nodes/node-factory";

export class Board {
  readonly context = new SceneContext();

  get scene() {
    return this.context.scene;
  }

  get nodes() {
    return this.context.nodeList;
  }

  createNode(nodeType: NodeType): void {
    this.scene.setCreatableNodeType(nodeType);
  }

  constructor() {
    keyDown$(this.context).subscribe();
    pointerMove$(this.context).subscribe();
    viewportDrag$(this.context).subscribe();
    viewportZoom$(this.context).subscribe();
    nodeSelect$(this.context).subscribe();
    nodeDrag$(this.context).subscribe();
    nodeResize$(this.context).subscribe();
    nodeCreate$(this.context).subscribe();

    this.context.idbService.getState('scene')
      .then(state => {
        Object.assign(this.context.scene, state);
        this.draw();
        this.context.changeState();
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
