module.exports = {
  publicPath: '/medium',
  outputDir: '../docs',

  transpileDependencies: [
    'vuetify'
  ],

  configureWebpack: {
    resolve: {
      fallback: {
        'path': require.resolve('path-browserify')
      }
    }
  }
}
