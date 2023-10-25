export enum MessageType {
    Close = "close",
    ConfigGet = "config-get",
    Exec = "exec",
    Open = "open",
}

export interface SqliteWorkerMessage {
    type: MessageType,
    args: object,
}

export interface SqliteWorkerResponse {
    type: MessageType
    result: object,
}


type WorkerMessageFunction = (message: SqliteWorkerMessage) => Promise<SqliteWorkerResponse>;
type TypeAndArgsFunction = (mt: MessageType, args: object) => Promise<SqliteWorkerResponse>;
export type SqliteClientFunction = WorkerMessageFunction & TypeAndArgsFunction;
