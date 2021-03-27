/* eslint-env node */
/* eslint-disable no-unused-vars */

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (isServer) {
      const newEntry = () => {
        return config.entry().then((entrypoints) => {
          return {
            ...entrypoints,
            'capture-playlist-snapshot': 'scripts/capture-playlist-snapshot'
          };
        });
      };

      // Important: return the modified config
      return {
        ...config,
        entry: newEntry,
      };
    }

    // Important: return the unmodified config for the client
    return config;
  },
};
