module.exports = {
  syntax: require('postcss-scss'),
  plugins: [
    require('@csstools/postcss-sass')({
      includePaths: ['node_modules']
    }),
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009'
      },
      stage: 3
    })
  ]
}
