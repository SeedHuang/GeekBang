const { config: {enviroment} } = require(`@root/package.json`);

exports.getEnv = (varName)=> {
    const env = process.env.enviroment;
    return enviroment[env][varName];
}