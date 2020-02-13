const proxy = [
  {
    context: '/api',
    target: 'http://localhost:51266',
    pathRewrite: {'^/api' : ''}
  }
];
module.exports = proxy;