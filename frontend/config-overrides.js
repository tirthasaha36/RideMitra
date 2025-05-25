const path = require('path');

module.exports = function override(config, env) {
  // Find the source-map-loader rule and exclude mapbox-gl
  if (config.module && config.module.rules) {
    config.module.rules.forEach(rule => {
      if (rule.loader && rule.loader.includes('source-map-loader')) {
        if (!rule.exclude) {
          rule.exclude = [];
        }
        if (Array.isArray(rule.exclude)) {
          rule.exclude.push(path.resolve(__dirname, 'node_modules/mapbox-gl'));
        } else {
          rule.exclude = [rule.exclude, path.resolve(__dirname, 'node_modules/mapbox-gl')];
        }
      }
    });
  }
  return config;
};
