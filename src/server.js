require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// Services
const PlaylistsService = require('./services/postgres/PlaylistsService');
const UserService = require('./services/postgres/UserService');

// Validators
const PlaylistsValidator = require('./api/playlists/validator');

// API Plugins
const playlists = require('./api/playlists');

// Error Classes
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  try {
    // Register JWT Plugin
    await server.register([
      {
        plugin: Jwt,
      },
    ]);

    // JWT Authentication Strategy
    server.auth.strategy('openmusic_jwt', 'jwt', {
      keys: process.env.ACCESS_TOKEN_KEY,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        maxAgeSec: process.env.ACCESS_TOKEN_AGE,
      },
      validate: (artifacts) => ({
        isValid: true,
        credentials: {
          id: artifacts.decoded.payload.id,
        },
      }),
    });

    // Services Instance
    const playlistsService = new PlaylistsService();

    // Register Plugins
    await server.register([
      {
        plugin: playlists,
        options: {
          service: playlistsService,
          validator: PlaylistsValidator,
        },
      },
      // Tambahkan plugin lain seperti users, songs, albums jika dibutuhkan
    ]);

    // Global error handler
    server.ext('onPreResponse', (request, h) => {
      const { response } = request;

      if (response instanceof Error) {
        // Client Error
        if (response instanceof ClientError) {
          const newResponse = h.response({
            status: 'fail',
            message: response.message,
          });
          newResponse.code(response.statusCode);
          return newResponse;
        }

        // Default error handler
        if (!response.isServer) {
          return h.continue;
        }

        // Server Error
        const newResponse = h.response({
          status: 'error',
          message: 'Maaf, terjadi kesalahan pada server kami.',
        });
        newResponse.code(500);
        console.error(response);
        return newResponse;
      }

      return h.continue;
    });

    // Start server
    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
  } catch (error) {
    console.error('Server gagal dimulai:', error);
    process.exit(1);
  }
};

init();
