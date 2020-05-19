module.exports = {
  purge: {
    mode: 'all',
    content: ['src/**/**/*.{html,js,jsx,ts,tsx}'],
  },
  prefix: '',
  important: false,
  separator: ':',
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        cyan: '#9cdbff',
      },
    },
  },
};
