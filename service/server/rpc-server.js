const net = require('net');
const { getEnv } = require('@tool/env');
const serverPort = getEnv('server').port;
module.exports = class RPC {
    constructor({ protobufRequestSchema, protobufResponseSchema }) {
        this.protobufRequestSchema = protobufRequestSchema;
        this.protobufResponseSchema = protobufResponseSchema;
    }
    decodeRequest(buffer) {
        console.log('[SERVER][DETAIL] Decode Request');
        const seq = buffer.readUInt32BE(); // 在没有参数逇情况，相当于参数为0，意思就是说，读第一个UInt32
        return {
            seq,
            result: this.protobufRequestSchema.decode(buffer.slice(8))
        }
    }
    isCompleteRequest(buffer) {
        const bodyLength = buffer.readUInt32BE(4);
        return 8 + bodyLength; //其实就是16
    }
    encodeResponse(data, seq) {
        console.log('[SERVER][DETAIL] Encode Response');
        const head = Buffer.alloc(8);
        const body = this.protobufResponseSchema.encode(data);
        head.writeUInt32BE(seq);
        head.writeUInt32BE(body.length, 4);
        return Buffer.concat([head,body]); 
    }
    createServer(callback) {
        let buffer = null;
        const tcpServer = net.createServer(socket => {
            socket.on('data', data => {
                console.log('[SERVER][RPCCORE]: ON GETDATA:', data);
                // 不断地拼接buff
                if((buffer && buffer.length > 0)) {
                    buffer = Buffer.concat([buffer, data]);
                } else {
                    buffer = data;
                }

                // 这个checkLength就是搞不懂，是不是名字取得不对；
                let checkLength = null;
                //这个循环不明白
                /*
                * bodyLength为request的总体大小，length包含了
                * 8 + body.length
                * 8为head的长度，因为head的总长被bBuffer.alloc(8)的长度
                * body.length则是request请求体的长度，
                * 但是buff的长度在一开始就是可以不断concat的，也就是说他是一个段落，每一段都是HEAD[seq(4)|bodylength(4)]|BODY(8)
                */
                while (buffer && (checkLength = this.isCompleteRequest(buffer))) {
                    let requestBuffer = null;
                    // 什么时候checkLength才会等于checkLength？
                    /**
                     * 由于buffer.length讲述的的客观分配的Buff大小，它并不会随着请求的体大小变化而变化，所以他是一个标尺
                     * this.isCompleteReqest, 实际获取的8 + buffer.readUInt32BE(4), head中body的长度即（buffer.readUInt32BE(4)）,因为是一个结构体的长度，而不论结构体的内容如何，结构体的decode之后的长度一直是8,8是一个非常范围相当于Uint64
                     * 这里很有意思的是每次返回的checkLength为16，所以接下来解释一下下面的含义
                    */
                    if (checkLength == buffer.length) { // checkoutLength:16, buffer.length：16 说明了，当前的请求buffer为最后一个，所以如果读完了，buffer就置空了
                        requestBuffer = buffer;
                        buffer = null;
                    } else { // checkoutLength:16, buffer.length > 16,通常都是32,64这些，那么说明还有request需要处理，
                        requestBuffer = buffer.slice(0, checkLength);//从buff里面拿出第一个request请求的完整长度，赋值给requestBuff
                        buffer = buffer.slice(checkLength);//然后将requestBuff从buff中去除，然后继续循环，支持checkLength == buffer.length之后，然后buffer被置为null
                    }
                    // woc，耐着性子终于看懂了
                    // 上面这段代码在整个代码里最让人疑惑的骑士就是this.isCompleteRequest这个方法，他的目标是活的一个request的长度，而不是是否是完整的请求，所以看上去非常难受，不知道在说什么
                    // 说的简单点，其实可以把他从while条件中放下来，其实 buffer.readUInt32BE(4),不可能为空 ，因为经过试验所知，一个request的proto对象的length就是8，不论里面的值是什么，而且更加不可能传null，因为id都是required的，随意只要有request buff，这个整个request的 长度就是16
                    // 真正控制这个while循环是否可以继续下去的是buffer，事实上，while循环中都是对于buffer的逐步删减




                    // 这里是将 seq和request body从 requestBuffer解析出来组成一个新的request对象
                    const request = this.decodeRequest(requestBuffer);
                    callback(
                        // 这是给call传递Request
                        {
                            body: request.result,
                            socket
                        },
                        // 这是给callback传递response能力
                        {
                            end: (data) => {
                                const buffer = this.encodeResponse(data, request.seq);
                                socket.write(buffer);
                            }
                        }
                    )
                }                
            });
        });
        tcpServer.listen(serverPort, (err)=>{
            if(err) {
                console.log(`[SERVER][RPCCORE ERROR]`,err);
            } else {
                console.log(`[SERVER][RPCCORE] is running on PORT:${serverPort}`)
            }
        });
    }
}