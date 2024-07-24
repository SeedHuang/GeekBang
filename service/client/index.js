const EasySock = require('easy_sock');
const fs = require('fs');
const { config: {enviroment} } = require(`@root/package.json`);
const schemas = require('@proto')('detail.proto');

module.exports = () => {
    const env = process.env.enviroment;
    console.log(`[CLIENT][ENV]${env}`);
    const easySock = new EasySock(enviroment[env].client);
    
    easySock.encode = function(data, seq) {
        const body = schemas.DetailRequest.encode(data)
        const head = Buffer.alloc(8);
        head.writeInt32BE(seq);
        head.writeInt32BE(body.length, 4);
        return Buffer.concat([head, body]);
    };
    
    easySock.decode = function(buffer) {
        console.log('[CLIENT]Socket Decode', buffer);
        const seq = buffer.readUInt32BE();
        const body = schemas.DetailResponse.decode(buffer.slice(8));
        return {
            result: body,
            seq
        }
    }
    
    easySock.isReceiveComplete = (buffer) => {
        // 如果小于8，则小于head
        // 一个完整的请求提包含head和body，head占8位，body占8位，head包含4位存储seq，4位存储body长度，body则是请求的内容，如果所以小于bodyLength + 8的意思是就是没有完整的body和head
        if(buffer.length < 8) {
            return 0;
        }
        const bodyLength = buffer.readUInt32BE(4);
    
        if(buffer.length >= bodyLength + 8) {
            console.log('[CLIENT]Socket is complete', bodyLength + 8);
            return bodyLength + 8;
        } else {
            console.log('[CLIENT]Socket is not complete', 0);
            return 0;
        }
    };

    return easySock;
}


