const vm = require('vm');
const template = require('@template');
exports.useTemplate = (templatePath, data) => {
    return vm.runInNewContext(template(templatePath), data);
};