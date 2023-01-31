import type { Board } from "../board";

export interface Shape {
  board: Board;
  id: number;
  x: number;
  y: number;
  fillColor: string;
  isHover: boolean;
  isSelected: boolean;
  checkHover(pointer: [number, number]): boolean;
  draw(): void;
  drawHover(): void;
  drawSelected(): void;
  setIsSelected(value: boolean): void;
  setXY([x, y]: [number, number]): void;
}

export abstract class AbstractShape implements Shape {
  board: Board;
  id: number;
  x: number;
  y: number;
  fillColor: string;
  isHover: boolean = false;
  isSelected: boolean = false;
  abstract checkHover(pointer: [number, number]): boolean;
  abstract draw(): void;
  abstract drawHover(): void;
  abstract drawSelected(): void;
  setIsSelected(value: boolean): void {
    this.isSelected = value;
  };
  setXY([x, y]: [number, number]): void {
    this.x = x;
    this.y = y;
  };

  constructor(board: Board, id: number, x: number, y: number, fillColor: string) {
    this.board = board;
    this.id = id;
    this.x = x;
    this.y = y;
    this.fillColor = fillColor;
  }
}
