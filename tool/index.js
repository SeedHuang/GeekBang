const fs = require('fs');
// 获得Tempalte
exports.getTemplate = (templateName) => {
    const text = fs.readFileSync(`${__dirname}/../template/${templateName}`, 'utf-8');
    return '`' + text + '`';
};