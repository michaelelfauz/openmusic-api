require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const { Pool } = require('pg');
const Boom = require('@hapi/boom'); // Import Boom
const { validateAlbum } = require('./validate');
const routes = require('./src/routes');

const init = async () => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  });

  server.route([
    {
      method: 'POST',
      path: '/albums',
      handler: async (request, h) => {
        try {
          const { name, year } = request.payload;
          const id = `album-${Date.now()}`;
          const query = 'INSERT INTO albums (id, name, year) VALUES($1, $2, $3) RETURNING id';
          const values = [id, name, year];
          const result = await pool.query(query, values);
          const albumId = result.rows[0].id;
          const response = h.response({
            status: 'success',
            data: {
              albumId,
            },
          });
          response.code(201);
          return response;
        } catch (error) {
          const response = h.response({
            status: 'fail', // Diubah dari 'error' menjadi 'fail'
            message: `Gagal menambahkan album: ${error.message}`,
          });
          response.code(500);
          console.error(error);
          return response;
        }
      },
      options: {
        validate: validateAlbum()
      },
    },
    {
      method: 'GET',
      path: '/albums/{id}',
      handler: async (request, h) => {
        try {
          const { id } = request.params;
          const queryAlbum = 'SELECT id, name, year FROM albums WHERE id = $1';
          const resultAlbum = await pool.query(queryAlbum, [id]);

          if (resultAlbum.rows.length > 0) {
            const album = resultAlbum.rows[0];
            const querySongs = 'SELECT id, title, performer FROM songs WHERE album_id = $1';
            const resultSongs = await pool.query(querySongs, [id]);
            album.songs = resultSongs.rows;
            return {
              status: 'success',
              data: {
                album,
              },
            };
          }

          const response = h.response({
            status: 'fail',
            message: 'Album tidak ditemukan',
          });
          response.code(404);
          return response;
        } catch (error) {
          const response = h.response({
            status: 'fail', // Diubah dari 'error' menjadi 'fail'
            message: `Gagal mendapatkan album: ${error.message}`,
          });
          response.code(500);
          console.error(error);
          return response;
        }
      },
    },
    {
      method: 'PUT',
      path: '/albums/{id}',
      handler: async (request, h) => {
        try {
          const { id } = request.params;
          const { name, year } = request.payload;
          console.info("REQUESTED PAYLOAD", id, name, year)
          
          const query = 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id';
          const values = [name, year, id];
          const result = await pool.query(query, values);

          if (result.rows.length > 0) {
            const response = h.response({
              status: 'success',
              message: 'Album berhasil diperbarui',
            });
            response.code(200);
            return response;
          }

          const response = h.response({
            status: 'fail',
            message: 'Album tidak ditemukan',
          });
          response.code(404);
          return response;
        } catch (error) {
          const response = h.response({
            status: 'fail', // Diubah dari 'error' menjadi 'fail'
            message: `Gagal memperbarui album: ${error.message}`,
          });
          response.code(500);
          console.error(error);
          return response;
        }
      },
      options: {
        validate: validateAlbum(),
      },
    },
    {
      method: 'DELETE',
      path: '/albums/{id}',
      handler: async (request, h) => {
        try {
          const { id } = request.params;
          const query = 'DELETE FROM albums WHERE id = $1 RETURNING id';
          const result = await pool.query(query, [id]);

          if (result.rows.length > 0) {
            const response = h.response({
              status: 'success',
              message: 'Album berhasil dihapus',
            });
            response.code(200);
            return response;
          }

          const response = h.response({
            status: 'fail',
            message: 'Album tidak ditemukan',
          });
          response.code(404);
          return response;
        } catch (error) {
          const response = h.response({
            status: 'fail', // Diubah dari 'error' menjadi 'fail'
            message: `Gagal menghapus album: ${error.message}`,
          });
          response.code(500);
          console.error(error);
          return response;
        }
      },
    },
    {
      method: 'GET',
      path: '/albums',
      handler: async (request, h) => {
        try {
          const query = 'SELECT id, name, year FROM albums';
          const result = await pool.query(query);
          return {
            status: 'success',
            data: {
              albums: result.rows,
            },
          };
        } catch (error) {
          const response = h.response({
            status: 'fail', // Diubah dari 'error' menjadi 'fail'
            message: `Gagal mendapatkan daftar album: ${error.message}`,
          });
          response.code(500);
          console.error(error);
          return response;
        }
      },
    },
  ]);

  server.route([
    {
      method: 'POST',
      path: '/songs',
      handler: async (request, h) => {
        try {
          const { title, year, genre, performer, duration, albumId } = request.payload;
          const id = `song-${Date.now()}`;
          const query = 'INSERT INTO songs (id, title, year, genre, performer, duration, album_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id';
          const values = [id, title, year, genre, performer, duration, albumId];
          const result = await pool.query(query, values);
          const songId = result.rows[0].id;
          const response = h.response({
            status: 'success',
            data: {
              songId,
            },
          });
          response.code(201);
          return response;
        } catch (error) {
          const response = h.response({
            status: 'fail', // Diubah dari 'error' menjadi 'fail'
            message: `Gagal menambahkan lagu: ${error.message}`,
          });
          response.code(500);
          console.error(error);
          return response;
        }
      },
      options: {
        validate: {
          payload: Joi.object({
            title: Joi.string().required(),
            year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
            genre: Joi.string().required(),
            performer: Joi.string().required(),
            duration: Joi.number().integer().optional().allow(null),
            albumId: Joi.string().optional().allow(null),
          }),
          failAction: (request, h, error) => {
            const response = Boom.badRequest(error.details.map((detail) => detail.message).join(', '));
            response.output.payload = {
              status: 'fail',
              message: error.details.map((detail) => detail.message).join(', '),
            };
            return response;
          },
        },
      },
    },
    {
      method: 'GET',
      path: '/songs',
      handler: async (request, h) => {
        try {
          const { title, performer } = request.query;
          let query = 'SELECT id, title, performer FROM songs';
          const values =[];
          const conditions =[];
          if (title) {
            conditions.push('LOWER(title) LIKE $' + (conditions.length + 1));
            values.push(`%${title.toLowerCase()}%`);
          }

          if (performer) {
            conditions.push('LOWER(performer) LIKE $' + (conditions.length + 1));
            values.push(`%${performer.toLowerCase()}%`);
          }

          if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
          }

          const result = await pool.query(query, values);
          return {
            status: 'success',
            data: {
              songs: result.rows,
            },
          };
        } catch (error) {
          const response = h.response({
            status: 'fail', // Diubah dari 'error' menjadi 'fail'
            message: `Gagal mendapatkan lagu: ${error.message}`,
          });
          response.code(500);
          console.error(error);
          return response;
        }
      },
    },
    {
      method: 'GET',
      path: '/songs/{id}',
      handler: async (request, h) => {
        try {
          const { id } = request.params;
          const query = 'SELECT id, title, year, genre, performer, duration, album_id FROM songs WHERE id = $1';
          const result = await pool.query(query, [id]);

          if (result.rows.length > 0) {
            return {
              status: 'success',
              data: {
                song: result.rows[0],
              },
            };
          }

          const response = h.response({
            status: 'fail',
            message: 'Lagu tidak ditemukan',
          });
          response.code(404);
          return response;
        } catch (error) {
          const response = h.response({
            status: 'fail', // Diubah dari 'error' menjadi 'fail'
            message: `Gagal mendapatkan lagu: ${error.message}`,
          });
          response.code(500);
          console.error(error);
          return response;
        }
      },
    },
    {
      method: 'PUT',
      path: '/songs/{id}',
      handler: async (request, h) => {
        try {
          const { id } = request.params;
          const { title, year, genre, performer, duration, albumId } = request.payload;
          const query = 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id';
          const values = [title, year, genre, performer, duration, albumId, id];
          const result = await pool.query(query, values);

          if (result.rows.length > 0) {
            const response = h.response({
              status: 'success',
              message: 'Lagu berhasil diperbarui',
            });
            response.code(200);
            return response;
          }

          const response = h.response({
            status: 'fail',
            message: 'Lagu tidak ditemukan',
          });
          response.code(404);
          return response;
        } catch (error) {
          const response = h.response({
            status: 'fail', // Diubah dari 'error' menjadi 'fail'
            message: `Gagal memperbarui lagu: ${error.message}`,
          });
          response.code(500);
          console.error(error);
          return response;
        }
      },
      options: {
        validate: {
          payload: Joi.object({
            title: Joi.string().required(),
            year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
            genre: Joi.string().required(),
            performer: Joi.string().required(),
            duration: Joi.number().integer().optional().allow(null),
            albumId: Joi.string().optional().allow(null),
          }),
          failAction: (request, h, error) => {
            const response = Boom.badRequest(error.details.map((detail) => detail.message).join(', '));
            response.output.payload = {
              status: 'fail',
              message: error.details.map((detail) => detail.message).join(', '),
            };
            return response;
          },
        },
      },
    },
    {
      method: 'DELETE',
      path: '/songs/{id}',
      handler: async (request, h) => {
        try {
          const { id } = request.params;
          const query = 'DELETE FROM songs WHERE id = $1 RETURNING id';
          const result = await pool.query(query, [id]);

          if (result.rows.length > 0) {
            const response = h.response({
              status: 'success',
              message: 'Lagu berhasil dihapus',
            });
            response.code(200);
            return response;
          }

          const response = h.response({
            status: 'fail',
            message: 'Lagu tidak ditemukan',
          });
          response.code(404);
          return response;
        } catch (error) {
          const response = h.response({
            status: 'fail', // Diubah dari 'error' menjadi 'fail'
            message: `Gagal menghapus lagu: ${error.message}`,
          });
          response.code(500);
          console.error(error);
          return response;
        }
      },
    },
  ]);
  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();