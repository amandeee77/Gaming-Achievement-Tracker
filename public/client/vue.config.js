module.exports = {
  devServer: {
    proxy: "http://localhost:3000"
  }
};
// This configuration proxies API requests from the Vue development server to the Express server running on port 3000.
