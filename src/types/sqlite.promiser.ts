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


export type SqliteClientFunction = ((mt: MessageType, args: object) => Promise<SqliteWorkerResponse>);
// TODO: Uh... should also type this, | ((message: SqliteWorkerMessage) => Promise<SqliteWorkerResponse>)