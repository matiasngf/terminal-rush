module.exports = (api) => {
  // This caches the Babel config
  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets: [
      ["@babel/preset-env", {
        "modules": false
      }],
      '@babel/preset-typescript',
      // Enable development transform of React with new automatic runtime
      ['@babel/preset-react', { development: !api.env('production'), runtime: 'classic' }],
    ],
    // ...(!api.env('production') && { plugins: ['react-refresh/babel'] }),
    plugins: [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-object-rest-spread",
    ]
  };
};
