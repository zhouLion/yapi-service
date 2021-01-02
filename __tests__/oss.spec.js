const { Oss } = require('../dist/Oss');
const fs = require('fs');
const { join } = require('path');

const TEST_CONFIG = fs.readFileSync(join(__dirname, '.env'), 'utf8');

const { 
    YAPI_SERVER,
    TOKEN,
    UID
} = JSON.parse(TEST_CONFIG);

console.log({ YAPI_SERVER, TOKEN, UID })

jest.setTimeout(10000);

// 获取一个未登录的Oss实例
function createYapiOss() {
    return new Oss(YAPI_SERVER);
}

describe("测试yapi-oss", () => {
    test("【登录前】-获取不到用户信息", async () => {
        const yapiOss = createYapiOss();
        const userStatus = await yapiOss.getUserStatus();
        expect(userStatus).toBeNull();
    });

    test("【登录】直接传cookies进行登录", async () => {
        const yapiOss = createYapiOss();
        const userStatusBeforeLogin = await yapiOss.getUserStatus();
        expect(userStatusBeforeLogin).toBeNull();
        const userStatus = await yapiOss.connectWithCookies(`_yapi_token=${TOKEN}; _yapi_uid=${UID}`);
        expect(userStatus).not.toBeNull();
    });

    test("【登录】使用yapi_token和yapi_uid登录", async () => {
        const yapiOss = createYapiOss();
        const userStatusBeforeLogin = await yapiOss.getUserStatus();
        expect(userStatusBeforeLogin).toBeNull();
        const userStatusAfterLogin = await yapiOss.connectWithCookies(TOKEN, UID);
        expect(userStatusAfterLogin).not.toBeNull();
    });

    test("【退出登录】不能再获取数据", async () => {
        const yapiOss = createYapiOss();
        const isDisconnected = yapiOss.disconnect();
        expect(isDisconnected).toBeTruthy();
        // 断开连接后, 查询用户数据也是空
        const userStatusAfterDisconnect = await yapiOss.getUserStatus();
        expect(userStatusAfterDisconnect).toBeNull();
    });

    test("【请求】各个请求数据的接口", async () => {
        const yapiOss = createYapiOss();
        yapiOss.connectWithCookies(TOKEN, UID);
        // > 
        const groupList = await yapiOss.getGroupList();
        expect(groupList).not.toBeNull();
        expect(groupList.data.length).not.toBe(0);
        
        // >
        const groupId = groupList[0]._id;
        console.log(groupId);
        expect(groupId).not.toBeNaN();
        expect(groupId).not.toBeNull();
        expect(groupId).not.toBeUndefined();

        // >
        const projectList = await yapiOss.getProjectList({ group_id: groupId, page: 1, limit: 9999 })
        console.log(projectList);
        expect(projectList).not.toBeNull();
        expect(projectList.list.length).not.toBe(0);
    })
});
