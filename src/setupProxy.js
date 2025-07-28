const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/fmp-api',
    createProxyMiddleware({
      target: 'https://financialmodelingprep.com',
      changeOrigin: true,
      pathRewrite: {
        '^/fmp-api': '/api/v3', // Rewrite the path
      },
      onProxyReq: (proxyReq) => {
        // Add any required headers here
        proxyReq.setHeader('Accept', 'application/json');
        console.log(`[PROXY] Proxying request: ${proxyReq.path}`);
      },
      onProxyRes: (proxyRes) => {
        console.log(`[PROXY] Received ${proxyRes.statusCode} from ${proxyRes.req.path}`);
      },
      onError: (err, req, res) => {
        console.error('[PROXY] Error:', err);
        res.status(500).json({ error: 'Proxy error', details: err.message });
      }
    })
  );
};
