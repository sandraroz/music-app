import _ from 'lodash';

export default {
  install(app) {
    // search for files we want to import
    const baseComponents = require.context(
      '../components/base',
      false,
      /[A-Za-z0-9-_,\s]+\.vue$/i
    );

    // import files individually
    baseComponents.keys().forEach((fileName) => {
      const componentConfig = baseComponents(fileName);

      // change the name to pascal case, remove the path slashes and .vue elements from the name
      const componentName = _.upperFirst(
        _.camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, ''))
      );

      // export default, prefix name with the base to avoid name collision
      app.component(
        `Base${componentName}`,
        componentConfig.default || componentConfig
      );
    });
  },
};
