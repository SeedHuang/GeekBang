const koa = require('koa');
const fs = require('fs');
const mount = require('koa-mount');
const koaStatic = require('koa-static');
const path = require('path');
const app = new koa();
const vm = require('vm');
const rpcClient = require('./service/detail/client');
const server = require('./service/detail/index');
// const detailService = require('./service/detail/index.js');
/*
管理静态资源，简单来说就是从哪一层进行查找
比如如果你设置是第二层的source文件夹，那就会从path层进行匹配(host/path的path)
http://localhost:3000/index.html就是从source目录下，直接查找是否存在index.html，所以如果这时候你的路径是http://localhost:3000/source/index.html就肯定找不到了
反而要将app.use(koaStatic(`${__dirname}/`))才行，但是这就相当于把根目录暴露出去了，所以我想最好的方法应道是增加静态资源文件夹的层数来解决这个问题
*/
// app.use(
//     koaStatic(`${__dirname}/static/`)
// );

// app.use(
//     mount(
//         '/',
//         async (ctx) => {
//             console.log(vm.runInNewContext('`<h2>${user.name}</h2>`', 
//                 { 
//                     user: {
//                         name: 'HuangChunhua'
//                     }
//                 }
//             ), '>>>>');
//             console.log('local host source page start...');
//             // ctx.body = fs.readFileSync(`${__dirname}/source/index.html`, 'utf-8');
//         }
//     )
// );

// app.listen(3000);

// detailService();
console.log('PORT4000 start run...');
server();
setTimeout(()=> {
    console.log('PORT 3000 client start run...');
    const client = rpcClient();
    client.write({
        id: 123123
    }, (err, data) => {
        if (err) {
            console.log('Has an Error:', err);
        } else {
            console.log('Success!!:', data);
        }
    });
},1000);
// const detailService = new koa();
// detailService.use()
// detailService.listen(3000);
