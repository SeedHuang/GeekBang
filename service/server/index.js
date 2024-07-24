const fs = require('fs');
const schemas = require('@proto')('detail.proto');
const server = require('@service/server/detail')(schemas.DetailRequest, schemas.DetailResponse);
const { spus } = require('@dataSource/spus.json');
/**
 * this method is using to creating server
*/
module.exports = () => {
    console.log('[SERVER]Create Server Instance')
    server.createServer((request, response) => {
        const { id } = request.body;

        if(id) {
            const target = spus.filter(spu => {
                if(spu.id === +id) {
                    return true;
                } else {
                    return false;
                }
            })
            if (target.length > 0) {
                const spu = target[0];
                console.log('SPU is', spu);
                response.end(spu); 
            } else {
                
            }
        }
        
    });
};
