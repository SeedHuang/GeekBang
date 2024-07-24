const fs = require('fs');
const protoBuff = require('protocol-buffers');
module.exports = (pathName) => {
    return protoBuff(fs.readFileSync(`${__dirname}/${pathName}`))
};