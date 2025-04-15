const Joi = require('joi');
const Boom = require('@hapi/boom');
const { validateSong } = require('./validate'); // Pastikan ini mengarah ke validator yang benar

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { pool }) => {
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
            return h.response({
              status: 'success',
              data: { songId },
            }).code(201);
          } catch (error) {
            console.error(error);
            return h.response({
              status: 'fail',
              message: `Gagal menambahkan lagu: ${error.message}`,
            }).code(500);
          }
        },
        options: {
          validate: validateSong(),
        },
      },
      {
        method: 'GET',
        path: '/songs',
        handler: async (request, h) => {
          try {
            const { title, performer } = request.query;
            let query = 'SELECT id, title, performer FROM songs';
            const values = [];
            const conditions = [];

            if (title) {
              conditions.push(`LOWER(title) LIKE $${values.length + 1}`);
              values.push(`%${title.toLowerCase()}%`);
            }

            if (performer) {
              conditions.push(`LOWER(performer) LIKE $${values.length + 1}`);
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
            console.error(error);
            return h.response({
              status: 'fail',
              message: `Gagal mendapatkan lagu: ${error.message}`,
            }).code(500);
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

            return h.response({
              status: 'fail',
              message: 'Lagu tidak ditemukan',
            }).code(404);
          } catch (error) {
            console.error(error);
            return h.response({
              status: 'fail',
              message: `Gagal mendapatkan lagu: ${error.message}`,
            }).code(500);
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
              return h.response({
                status: 'success',
                message: 'Lagu berhasil diperbarui',
              }).code(200);
            }

            return h.response({
              status: 'fail',
              message: 'Lagu tidak ditemukan',
            }).code(404);
          } catch (error) {
            console.error(error);
            return h.response({
              status: 'fail',
              message: `Gagal memperbarui lagu: ${error.message}`,
            }).code(500);
          }
        },
        options: {
          validate: validateSong(),
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
              return h.response({
                status: 'success',
                message: 'Lagu berhasil dihapus',
              }).code(200);
            }

            return h.response({
              status: 'fail',
              message: 'Lagu tidak ditemukan',
            }).code(404);
          } catch (error) {
            console.error(error);
            return h.response({
              status: 'fail',
              message: `Gagal menghapus lagu: ${error.message}`,
            }).code(500);
          }
        },
      },
    ]);
  },
};
