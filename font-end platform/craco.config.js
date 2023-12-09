/* craco.config.js */
const CracoLessPlugin = require('craco-less');
module.exports = {
    plugins: [
        {
          plugin: CracoLessPlugin,
          options: {
            lessLoaderOptions: {
              lessOptions: {
                modifyVars: { '@primary-color': '#ccc' },//'#ABB1DF'
                javascriptEnabled: true,
              },
            },
          },
        },
      ],
  };