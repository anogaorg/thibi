export enum MessageType {
  Close = "close",
  ConfigGet = "config-get",
  Exec = "exec",
  Open = "open",
}

export interface SqliteWorkerMessage {
  type: MessageType;
  args: object;
}

export interface SqliteWorkerResponse {
  type: MessageType | "error";
  result: object;
}

type WorkerMessageFunction = (
  message: SqliteWorkerMessage,
) => Promise<SqliteWorkerResponse>;
// Potential TODO: Technically it can only be string for particular MessageType. Maybe there's a better way of expressing that.
type TypeAndArgsFunction = (
  mt: MessageType,
  args: object | string,
) => Promise<SqliteWorkerResponse>;
export type SqliteClientFunction = WorkerMessageFunction & TypeAndArgsFunction;
