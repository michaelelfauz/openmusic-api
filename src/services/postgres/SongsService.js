const { Pool } = require('pg');
const { InvariantError } = require('../../exceptions');

class SongsService {
  constructor(pool) {
    this._pool = pool;
  }

  async addSong({ title, year, genre, performer, duration, albumId, id }) {
    const query = {
      text: 'INSERT INTO songs (id, title, year, genre, performer, duration, album_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan lagu');
    }

    return result.rows[0].id;
  }

  async getAllSongs({ title, performer }) {
    let query = 'SELECT id, title, performer FROM songs';
    const values = [];

    if (title) {
      values.push(`%${title}%`);
      query += ' WHERE title LIKE $1';
    }

    if (performer) {
      values.push(`%${performer}%`);
      query += values.length > 0 ? ' AND' : ' WHERE';
      query += ` performer LIKE $${values.length}`;
    }

    const result = await this._pool.query({ text: query, values });
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT id, title, year, genre, performer, duration, album_id FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('Lagu tidak ditemukan');
    }

    return result.rows[0];
  }

  async updateSongById(id, { title, year, genre, performer, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('Gagal menghapus lagu. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;