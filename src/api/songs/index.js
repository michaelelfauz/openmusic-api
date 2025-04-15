const createSongRoutes = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { pool }) => {
    server.route(createSongRoutes(pool));
  },
};
