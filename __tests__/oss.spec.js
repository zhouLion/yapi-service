const { Oss } = require('../dist/Oss');
const fs = require('fs');
const { join } = require('path');

const TEST_CONFIG = fs.readFileSync(join(__dirname, '.env'), 'utf8');

const { 
    YAPI_SERVER,
    TOKEN,
    UID
} = JSON.parse(TEST_CONFIG);

console.table({
    YAPI_SERVER,
    TOKEN,
    UID
})

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
});
