import Axios, { AxiosInstance } from "axios";
import { URL } from "url";
import { YapiReqPage, YapiResponse, YapiResPage } from '../typings/base';
import {
    UserStatus, Group, Project, ProjectCollected, InterfaceMenu, Interface, ShortlyInterface
} from "../typings/yapi";

const YAPI_URL = {
    /** 使用token票据登录 */
    USER_LOGIN_BY_TOKEN: "api/user/login_by_token",
    /** 账号登录 */
    USER_LOGIN: "api/user/login",
    /** 账户信息 */
    USER_STATUS: "api/user/status",
    /** 分组列表 */
    GROUP_LIST: "api/group/list",
    /** 项目 */
    PROJECTS: "api/project/list",
    /** 项目 */
    PROJECT: "api/project/get",
    /** 项目下的接口菜单树 */
    INTERFACE_LIST_MENU: "api/interface/list_menu",
    /** 项目下接口列表 */
    INTERFACE_LIST: "api/interface/list",
    /** 项目下接口目录 */
    INTERFACE_LIST_CAT: "api/interface/list_cat",
    /** 项目下某个接口详情 */
    INTERFACE_GET: "api/interface/get",
}

const throwError = (error: Error) => console.error(error.message);

export class Oss {
    /**
     * YOss
     * @param serverUrl yapi服务部署的hostname，如 https://yapi.baidu.com。
     * @param cookie
     * @example
     * // 如果已经在客户端登录，可以直接将cookie作为参数传进来
     * const yapiOss = new YOss("https://yapi.baidu.com", "_yapi_token={token}; _yapi_uid={uid}")
     * @example // cookie非必传参数， 可以通过登录生成
     * const yapiOss = new YOss("https://yapi.baidu.com");
     * yapiOss.connectWithCookies({ username, password });
     */
    constructor(serverUrl: string, cookie?: string) {
        if (!serverUrl) {
            throw new Error('serverUrl不能为空');
        }
        this._serverUrl = serverUrl;
        this._cookie = cookie || '';
        this._axios = Axios.create({
            timeout: 10 * 1000,
        })
        this._axios.defaults.baseURL = this._serverUrl;
        this._axios.interceptors.request.use((config) => {
            config.headers = this._headers;
            return config;
        });
        this._axios.interceptors.response.use((response) => {
            return response;
        });
    }

    private _cookie: string;
    private _serverUrl: string;
    private _axios: AxiosInstance;

    private get _headers() {
        const url = new URL(this._serverUrl);
        return {
            Cookie: this._cookie,
            Host: url.host,
            Referer: this._serverUrl,
        }
    }

    /**
     * 拼装cookies字段
     */
    assembleCookie(responseHeaders: any) {
        const extractCookie = (str: string) => str.split(";")[0];
        const cookiesList: string[] = responseHeaders['set-cookie'];
        this._cookie = cookiesList
            .map((cookieStr: string) => extractCookie(cookieStr))
            .join(";");
    }

    /**
     * 使用cookie连接
     * @param cookie
     * @description 直接传cookies，这个cookies就是每个yapi请求的Request Headers中的Cookie对应的值
     */
    connectWithCookies(cookie: string): Promise<YapiResponse<UserStatus> | null>
    /**
     * 从token和uic两部分拼接cookies，可以从devtool>application>coockies中分别复制
     * @param token headers中的token
     * @param uid headers中的uid
     */
    // tslint:disable-next-line: unified-signatures
    connectWithCookies(token: string, uid: string): Promise<YapiResponse<UserStatus> | null>
    connectWithCookies(...args: string[]) {
        if (args.length === 1) {
            this._cookie = args[0]
        } else if (args.length === 2) {
            const [token, uid] = args;
            this._cookie = `_yapi_token=${token}; _yapi_uid=${uid}`;
        }
        return this.getUserStatus();
    }

    /**
     * 断开连接
     * @description 清空了内存中的cookies， 并非调用yapi的退出登录接口
     */
    disconnect() {
        console.log('退出登录了');
        this._cookie = '';
        return true;
    }

    /**
     * 使用token登录
     * @param token
     * @deprecated
     */
    async doLoginByToken(token: string) {
        try {
            const response = await this._axios.get(YAPI_URL.USER_LOGIN_BY_TOKEN, {
                params: { token },
            });
            this.assembleCookie(response.headers);
            return true;
        } catch (error) {
            throwError(error);
            return false;
        }
    }

    /**
     * 使用账号密码登录
     * @param payload
     */
    async doLoginByAccount(payload: {
        username: string,
        password: string,
    }) {
        try {
            const response = await this._axios
                .get(YAPI_URL.USER_LOGIN, {
                    params: payload,
                });
            this.assembleCookie(response.headers);
            return true;
        } catch (error) {
            throwError(error);
            return false;
        }
    }

    /**
     * 获取用户信息、状态。主要用于验证身份或者会话有效
     */
    async getUserStatus() {
        try {
            const response = await this._axios
                .get<
                    YapiResponse<UserStatus>
                >(YAPI_URL.USER_STATUS);
            return response.data;
        } catch (error) {
            console.log(error.message);
            return null;
        }
    }

    /**
     * 获取分组信息列表
     */
    async getGroupList() {
        try {
            const response = await this._axios
                .get<
                    YapiResponse<Group[]>
                >(YAPI_URL.GROUP_LIST);
            return response.data;
        } catch (error) {
            throwError(error);
            return null;
        }
    }

    /**
     * 获取分组下的项目列表-分页
     * @param payload
     */
    async getProjectList(
        payload: YapiReqPage<{ group_id: number }>
    ) {
        try {
            const response = await this._axios
                .get<
                    YapiResponse<{
                        list: (Project | ProjectCollected)[]
                    }>
                >(YAPI_URL.PROJECTS, {
                    params: payload
                });
            return response.data.data;
        } catch (error) {
            throwError(error);
            return null;
        }
    }

    /**
     * 查询项目下的接口分组， 对应yapi文档中左侧菜单
     * @param project_id
     */
    async getInterfaceMenu(project_id: string) {
        try {
            const response = await this._axios
                .get<
                    YapiResponse<InterfaceMenu[]>
                >(YAPI_URL.INTERFACE_LIST_MENU, {
                    params: {
                        project_id,
                    }
                });
            return response.data.data;
        } catch (error) {
            throwError(error);
            return null;
        }
    }

    /**
     * 查询项目下的接口，返回分页数据。如果不想分页，可以将limit传非常大的数值 eg 9999
     * @param payload
     */
    async getInterfaceListByProjectId(payload: YapiReqPage<{ project_id: number }>) {
        try {
            const response = await this._axios
                .get<
                    YapiResponse<YapiResPage<ShortlyInterface>>
                >(YAPI_URL.INTERFACE_LIST, {
                    params: payload,
                })
            return response.data.data;
        } catch (error) {
            throwError(error);
            return null;
        }
    }

    /**
     * 查询一个分类下的接口，返回分页数据。如果不想分页，可以将limit传非常大的数值 eg 9999
     * @param payload
     */
    async getInterfaceListByCategoryId(payload: YapiReqPage<{ catid: string }>) {
        try {
            const response = await this._axios
                .get<
                    YapiResponse<YapiResPage<ShortlyInterface>>
                >(YAPI_URL.INTERFACE_LIST_CAT, {
                    params: payload,
                });
            return response.data.data;
        } catch (error) {
            throwError(error);
            return null;
        }
    }

    /**
     * 查询接口详情
     * @param id
     */
    async getInterfaceById(id: string) {
        try {
            const response = await this._axios
                .get<
                    YapiResponse<Interface>
                >(YAPI_URL.INTERFACE_GET, {
                    params: { id },
                });
            return response.data.data;
        } catch (error) {
            throwError(error);
            return null;
        }
    }
}
