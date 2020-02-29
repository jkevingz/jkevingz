const mix = require('laravel-mix');

const vuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const webpackConfig = {
   plugins: [
      new vuetifyLoaderPlugin(),
   ],
};
mix.webpackConfig(webpackConfig);

mix.ts('resources/js/app.ts', 'public/js')
   .sass('resources/sass/app.scss', 'public/css');
