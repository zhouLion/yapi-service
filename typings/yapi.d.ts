export interface UserStatus {
    add_time: number
    email: string
    role: string
    study: boolean
    type: string
    up_time: number
    username: string
    _id: number
}
export interface Group {
    _id: number;
    type: 'private' | 'public';
    group_name: string;
    add_time: number;
    up_time: number;
    role: string;
    [custom_field: string]: any;
}

export interface Project {
    switch_notice: boolean;
    _id: string;
    name: string;
    desc: string;
    basepath: string;
    project_type: string;
    uid: number;
    group_id: number;
    icon: string;
    color: string;
    add_time: number;
    up_time: number;
    env: any[];
}

export interface ProjectCollected {
    _id: number;
    uid: number;
    projectid: string;
    projectname: string;
    icon: string;
    color: string;
    __v: number;
    follow: boolean;
}

export interface InterfaceMenu {
    add_time: number
    desc: string
    index: number
    list: ShortlyInterface[]
    name: string
    project_id: number
    uid: number
    up_time: number
    __v: number
    _id: number
}


export interface Category {
    add_time: number
    api_opened: boolean
    catid: number
    edit_uid: number
    method: string
    path: string
    project_id: number
    status: string
    tag: string[]
    title: string
    uid: number
    _id: number
}

export interface ShortlyInterface {
    add_time: number
    catid: number
    edit_uid: number
    index: number
    method: string
    path: string
    project_id: number
    status: string
    tag: string[]
    title: string
    uid: number
    up_time: number
    _id: number
}

export interface Interface {
    _id: number
    add_time: number
    api_opened: boolean
    catid: number
    desc: string
    edit_uid: number
    index: number
    method: string
    path: string
    project_id: number
    query_path: {
        path: string,
        params: any[]
    }
    req_body_form: any[]
    req_body_is_json_schema: boolean
    req_body_other: string
    req_body_type: string
    req_headers: any[]
    req_params: any[]
    req_query: any[]
    res_body: string
    res_body_is_json_schema: boolean
    // TODO 补充res_body_type的类型声明
    res_body_type: string
    status: string
    tag: string[]
    title: string
    type: string
    uid: number
    up_time: number
    username: string
    __v: number
    errcode: number
}
