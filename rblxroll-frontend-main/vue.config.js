module.exports = {
  outputDir: '../rblxroll-backend-main/dist',
  devServer: {
    host: '0.0.0.0',
    port: 5000,
    disableHostCheck: true,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      },
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/captcha': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/callback': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/public': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
};
