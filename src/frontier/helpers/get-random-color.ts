import { COLOR_POOL } from "../constants/color.constants";

export const getRandomColor = () => COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)]
