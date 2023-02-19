import { COLOR_POOL } from "../constants/colors";

export const getRandomColor = () => COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)]
