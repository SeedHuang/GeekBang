const RPC = require('@service/server/rpc-server');

module.exports = (protobufRequestSchema, protobufResponseSchema) => {
    console.log('[SERVER DETAIL]Creating RPC Server Instance ...');
    return new RPC({
        decodeRequest(buffer) {
            console.log('[SERVER DETAIL] Decode Request');
            const seq = buffer.readUInt32BE(); // 在没有参数逇情况，相当于参数为0，意思就是说，读第一个UInt32
            return {
                seq,
                result: protobufRequestSchema.decode(buffer.slice(8))
            }
        },
        isCompleteRequest(buffer) {
            const bodyLength = buffer.readUInt32BE(4);
            return 8 + bodyLength; //其实就是16
        },
        encodeResponse(data, seq) {
            console.log('[SERVER DETAIL] Encode Response');
            const head = Buffer.alloc(8);
            const body = protobufResponseSchema.encode(data);
            head.writeUInt32BE(seq);
            head.writeUInt32BE(body.length, 4);
            return Buffer.concat([head,body]); 
        }
    });
}