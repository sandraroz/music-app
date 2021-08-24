import camelCase from 'lodash';

const requireModule = require.context('.', false, /\.js$/);

const modules = {};

requireModule.keys().forEach((fileName) => {
  // do not load current file since already loaded
  if (fileName === './index.js' || fileName === './dummy.js') {
    return;
  }

  const moduleConfig = requireModule(fileName);

  // camel case the name and remove path and .js
  const moduleName = camelCase(fileName.replace(/(\.\/|\.js)/g, ''));

  // export default
  modules[moduleName] = moduleConfig.default || moduleConfig;
});

export default modules;
