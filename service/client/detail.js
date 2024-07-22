const EasySock = require('easy_sock');
const protobuf = require('protocol-buffers');
const fs = require('fs');
const schemas = protobuf(fs.readFileSync(`${__dirname}/../proto/detail.proto`))
console.log(__dirname); 
console.log(schemas);

module.exports = () => {
    const easySock = new EasySock({
        ip: '127.0.0.1',
        port: 4000,
        timeout: 500,
        keepAlive: true
    });
    
    easySock.encode = function(data, seq) {
        console.log('ennnnnnnnnncoding......', data);
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


