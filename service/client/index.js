const EasySock = require('easy_sock');
const fs = require('fs');
const { config: {enviroment} } = require(`@root/package.json`);
const schemas = require('@proto')('detail.proto');

module.exports = () => {
    console.log(enviroment);
    const env = process.env.enviroment;
    
    const easySock = new EasySock(enviroment[env].client);
    
    easySock.encode = function(data, seq) {
        const body = schemas.DetailRequest.encode(data)
        const head = Buffer.alloc(8);
        head.writeInt32BE(seq);
        head.writeInt32BE(body.length, 4);
        return Buffer.concat([head, body]);
    };
    
    easySock.decode = function(buffer) {
        console.log('deeeeeeeeeecoding....', buffer);
        const seq = buffer.readUInt32BE();
        const body = schemas.DetailResponse.decode(buffer.slice(8));
        return {
            result: body,
            seq
        }
    }
    
    easySock.isReceiveComplete = (buffer) => {
        // 如果小于8，则小于head
        if(buffer.length < 8) {
            return 0;
        }
        const bodyLength = buffer.readUInt32BE(4);
    
        if(buffer.length >= bodyLength + 8) {
            console.log('client:is complete:', bodyLength + 8);
            return bodyLength + 8;
        } else {
            console.log('client:is complete:', 0);
            return 0;
        }
    };

    return easySock;
}


