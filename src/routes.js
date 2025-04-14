// src/routes.js

const albumsHandler = require('./api/albums/handler');
const playlistsHandler = require('./api/playlists/PlaylistsHandler');

const routes = (playlistsHandler, albumsHandler) => [
  // Routes untuk album
  {
    method: 'POST',
    path: '/albums',
    handler: albumsHandler.postAlbumHandler,
    options: {
      validate: {
        payload: albumsHandler.AlbumPayloadSchema,
      },
    },
  },
  {
    method: 'GET',
    path: '/albums',
    handler: albumsHandler.getAllAlbumsHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: albumsHandler.getAlbumByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: albumsHandler.putAlbumByIdHandler,
    options: {
      validate: {
        payload: albumsHandler.AlbumPayloadSchema,
      },
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: albumsHandler.deleteAlbumByIdHandler,
  },

  // Routes untuk playlist
  {
    method: 'POST',
    path: '/playlists',
    handler: playlistsHandler.postPlaylistHandler,
    options: {
      validate: {
        payload: playlistsHandler.validatePostPlaylistPayload,
      },
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: playlistsHandler.getUserPlaylistsHandler,
  },
  {
    method: 'GET',
    path: '/playlists/{id}',
    handler: playlistsHandler.getSongsFromPlaylistHandler,
  },
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs',
    handler: playlistsHandler.postSongToPlaylistHandler,
    options: {
      validate: {
        payload: playlistsHandler.validatePostSongToPlaylistPayload,
      },
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}/songs',
    handler: playlistsHandler.deleteSongFromPlaylistHandler,
    options: {
      validate: {
        payload: playlistsHandler.validateDeleteSongFromPlaylistPayload,
      },
    },
  },
];

module.exports = routes;
