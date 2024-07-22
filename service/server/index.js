const fs = require('fs');
const protobuf = require('protocol-buffers');
const schemas = protobuf(fs.readFileSync(`${__dirname}/../proto/detail.proto`));

const server = require('./detail')(schemas.DetailRequest, schemas.DetailResponse);
console.log('Loading Service ??????');
module.exports = () => {
    console.log('1> Creating Server ....');
    server.createServer((request, response) => {
        const id = request.body;
        response.end({
            id: 123,
            name: 'One Piece',
            price: 25
        });
    }).listen(4000, () => {
        console.log(`SERVER IS RUNNING ON PORT:>>>>>`);
    })    
};
