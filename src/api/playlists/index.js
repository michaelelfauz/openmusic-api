const PlaylistsHandler = require('./PlaylistsHandler');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const handler = new PlaylistsHandler(service, validator);

    server.route([
      {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistHandler,
        options: {
          auth: 'openmusic_jwt',
        },
      },
      {
        method: 'GET',
        path: '/playlists',
        handler: handler.getUserPlaylistsHandler,
        options: {
          auth: 'openmusic_jwt',
        },
      },
      {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylistByIdHandler,
        options: {
          auth: 'openmusic_jwt',
        },
      },
    ]);
  },
};
