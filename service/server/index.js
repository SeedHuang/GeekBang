const fs = require('fs');
const schemas = require('@proto')('detail.proto');
const server = require('@service/server/detail')(schemas.DetailRequest, schemas.DetailResponse);
const { getEnv } = require('@tool/env');
/**
 * this method is using to creating server
*/
module.exports = () => {
    console.log('[SERVER]: Create Server Instance')
    server.createServer((request, response) => {
        const id = request.body;
        response.end({
            id: 123,
            name: 'One Piece',
            price: 25
        });
    });
};
