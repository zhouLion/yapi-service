export type YapiReqPage<T> = T & {
    page: number
    limit: number
}

export interface YapiResponse<T> {
    data: T
    errmsg: string
    errcode: string
}

export interface YapiResPage<T> {
    list: T[]
    total: number
    count: number
}
