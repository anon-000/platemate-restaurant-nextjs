// module.exports = {
//   reactStrictMode: true,
// };
const withPlugins = require('next-compose-plugins');
// const optimizedImages = require('next-optimized-images');

const defaultConfig = require('./config/default.json');
const productionConfig = require('./config/production.json');

module.exports = withPlugins([

  (phase, { config }) => {
    if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
      return {
        ...config,
        env: {
          ...defaultConfig,
          ...productionConfig,
        },
      };
    }
    return {
      ...config,
      env: defaultConfig
      // images: {
      //   disableStaticImages: true
      // }
    };
  },
  // your other plugins here
]);