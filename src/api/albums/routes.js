const Joi = require('joi');
const Boom = require('@hapi/boom');
const { validateAlbum } = require('./validator');

const createAlbumRoutes = (pool) => [
  {
    method: 'POST',
    path: '/albums',
    handler: async (request, h) => {
      try {
        const { name, year } = request.payload;
        const id = `album-${Date.now()}`;
        const query = 'INSERT INTO albums (id, name, year) VALUES($1, $2, $3) RETURNING id';
        const result = await pool.query(query, [id, name, year]);

        return h.response({
          status: 'success',
          data: { albumId: result.rows[0].id },
        }).code(201);
      } catch (error) {
        return h.response({
          status: 'fail',
          message: `Gagal menambahkan album: ${error.message}`,
        }).code(500);
      }
    },
    options: {
      validate: validateAlbum(),
    },
  },
  {
    method: 'GET',
    path: '/albums',
    handler: async (request, h) => {
      try {
        const result = await pool.query('SELECT id, name, year FROM albums');
        return {
          status: 'success',
          data: { albums: result.rows },
        };
      } catch (error) {
        return h.response({
          status: 'fail',
          message: `Gagal mendapatkan daftar album: ${error.message}`,
        }).code(500);
      }
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const resultAlbum = await pool.query('SELECT id, name, year FROM albums WHERE id = $1', [id]);

        if (resultAlbum.rows.length === 0) {
          return h.response({
            status: 'fail',
            message: 'Album tidak ditemukan',
          }).code(404);
        }

        const album = resultAlbum.rows[0];
        const resultSongs = await pool.query('SELECT id, title, performer FROM songs WHERE album_id = $1', [id]);
        album.songs = resultSongs.rows;

        return {
          status: 'success',
          data: { album },
        };
      } catch (error) {
        return h.response({
          status: 'fail',
          message: `Gagal mendapatkan album: ${error.message}`,
        }).code(500);
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
        const result = await pool.query(
          'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
          [name, year, id]
        );

        if (result.rows.length === 0) {
          return h.response({
            status: 'fail',
            message: 'Album tidak ditemukan',
          }).code(404);
        }

        return h.response({
          status: 'success',
          message: 'Album berhasil diperbarui',
        }).code(200);
      } catch (error) {
        return h.response({
          status: 'fail',
          message: `Gagal memperbarui album: ${error.message}`,
        }).code(500);
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
        const result = await pool.query('DELETE FROM albums WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
          return h.response({
            status: 'fail',
            message: 'Album tidak ditemukan',
          }).code(404);
        }

        return h.response({
          status: 'success',
          message: 'Album berhasil dihapus',
        }).code(200);
      } catch (error) {
        return h.response({
          status: 'fail',
          message: `Gagal menghapus album: ${error.message}`,
        }).code(500);
      }
    },
  },
];

module.exports = createAlbumRoutes;
