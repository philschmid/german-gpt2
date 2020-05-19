const tailwindcss = require('tailwindcss');
const easyImport = require('postcss-easy-import');
const nested = require('postcss-nested');
const customProperties = require('postcss-custom-properties');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const plugins = [];
// plugins.push(tailwindcss);
plugins.push(tailwindcss('tailwind.config.js'));
// This is if you want to include your custom config
plugins.push(easyImport);
plugins.push(nested);
plugins.push(customProperties);
plugins.push(autoprefixer);
plugins.push(cssnano);

// if (!IS_DEVELOPMENT) {
//   const purgecss = require('@fullhuman/postcss-purgecss');

//   class TailwindExtractor {
//     static extract(content) {
//       return content.match(/[A-z0-9-:\/]+/g) || [];
//     }
//   }

//   // plugins.push(
//   //   purgecss({
//   //     content: ['src/**/**/*.{html,js,jsx,ts,tsx}'],
//   //     extractors: [
//   //       {
//   //         extractor: TailwindExtractor,
//   //         extensions: ['html'],
//   //       },
//   //     ],
//   //   }),
//   // );
// }

module.exports = {plugins};
