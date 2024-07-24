require('module-alias/register') //如果想使用module-alias方法，首先要在启动script里面添加register，可查看本项目start.sh，同时需要将module-alias/register在入口项目中首先引用
const koa = require('koa');
const mount = require('koa-mount');
const koaStatic = require('koa-static');
const clientRun = require('@service/client');
const serverRun = require('@service/server');
const { useTemplate } = require('@tool');
const { getEnv } = require('@tool/env');


const clientPort = getEnv('page').port;
let clientApp = null;
const sendRequest = async (parameter) => {
    return new Promise((resolve , reject)=> {
        if(clientApp) {
            clientApp.write(parameter, (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } else {
            reject("client App is not ready");
        }
    })
};
/*
管理静态资源，简单来说就是从哪一层进行查找
比如如果你设置是第二层的source文件夹，那就会从path层进行匹配(host/path的path)
http://localhost:3000/index.html就是从source目录下，直接查找是否存在index.html，所以如果这时候你的路径是http://localhost:3000/source/index.html就肯定找不到了
反而要将app.use(koaStatic(`${__dirname}/`))才行，但是这就相当于把根目录暴露出去了，所以我想最好的方法应道是增加静态资源文件夹的层数来解决这个问题
*/
const app = new koa();
app.use(
    koaStatic(`${__dirname}/static/`)
);

app.use(
    mount(
        '/detail.html',
        async (ctx) => {
            if(clientApp) {
                console.log(`[APP][ROUNT][PAGE][DETAIL]`)
                try {
                    const { id } = ctx.query;
                    if(!id) {
                        throw new Error('This page missing query id');
                    }
                    const result = await sendRequest({ id });
                    const html = useTemplate('detail.html', result);
                    ctx.body = html;
                } catch(e) {
                    console.error(`[APP][ROUNT][PAGE][DETAIL]We got an Error ${e}`);
                    const html = useTemplate('error.html', {message: e});
                    ctx.body = html;
                }
            }
        }
    )
);
// listen on 5233 for html
app.listen(clientPort, ()=> {
    console.log(`[APP][PORT]${clientPort}`);
});

serverRun();

setTimeout(()=> {
    clientApp =  clientRun();
},1000);
