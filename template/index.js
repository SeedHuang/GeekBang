const fs = require('fs');
module.exports = (pathName) => {
    const text = fs.readFileSync(`${__dirname}/${pathName}`, 'utf-8');
    return '`' + text + '`';
};