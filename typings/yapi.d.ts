// TODO: 补全yapi的类型声明
export interface CategoryList {
    [s: string]: any;
}
export interface YapiGroup {
    [s: string]: any;
}
export interface YapiGroupProject {
    [s: string]: any;
}
export type YapiPage<T> = T & {
    page: number
    limit: number
}
export interface YapiUserStatus {
    [s: string]: any;
}
export type YapiResPage<ListItem> = {
    list: ListItem[]
    total: number
    count: number
}

export interface Interface {
    [s: string]: any;
}