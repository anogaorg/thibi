import { createContext } from "react";
import { SqliteClientFunction } from "./types/sqlite.promiser";

export const SqliteContext = createContext({} as SqliteClientFunction);
