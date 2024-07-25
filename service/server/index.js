const fs = require('fs');
const schemas = require('@proto')('detail.proto');
const RPC = require('@service/server/rpc-server');
const { spus } = require('@dataSource/spus.json');
/**
 * this method is using to creating server
*/
module.exports = () => {
    console.log('[SERVER]Create Server Instance')
    const server = new RPC({
        protobufRequestSchema:schemas.DetailRequest, 
        protobufResponseSchema:schemas.DetailResponse
    });
    server.createServer(async (request, response) => {
        try {
            const result = await new Promise((resolve, reject)=> {
                const { id } = request.body;
                if(id) {
                    setTimeout(()=>{
                        const target = spus.filter(spu => {
                            if(spu.id === +id) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        if (target.length > 0) {
                            resolve(target[0]);    
                        } else {
                            reject(`There aren't this spu`);
                        }
                    },1000)
                }
            });
            response.end(result);
        } catch(e) {
            console.log(e, '??????');
        }
        
        
        
    });
};
