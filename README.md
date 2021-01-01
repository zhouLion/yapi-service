# yapi service

针对yapi接口文档服务做的一些扩展开发
> 关于yapi：https://yapi.baidu.com/

## 具体功能
- [x] Oss: 在backend，通过指定**yapi服务**和**票据（cookies）**，实现对yapi后台接口的透传功能。目前只做了对**获取**yapi数据相关接口的透传。
- [x] api2Ts: // TODO 将yapi格式的接口文档转成web端可调用的ts或者js文件。
- [x] ...TODO 

## 安装
> TODO: 尚未发布到npm 

## 开发
- 1、通过git获取到源码
- 2、安装依赖包：`npm install`或 `npm i`
- 3、运行`npm run dev`启动tsc的监听器进行开发

## 测试用例
项目使用jest进行单元测试，测试用例所在目录：`/__tests__/` ，另见说明[README.md](./__tests__/README.md)
