class PlaylistsService {
  constructor(pool) {
    this._pool = pool;
  }

  async addPlaylist({ name, owner }) {
    const result = await this._pool.query(
      'INSERT INTO playlists (name, owner) VALUES ($1, $2) RETURNING id',
      [name, owner]
    );
    return result.rows[0].id;
  }

  async getUserPlaylists(owner) {
    const result = await this._pool.query(
      'SELECT id, name FROM playlists WHERE owner = $1',
      [owner]
    );
    return result.rows;
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const result = await this._pool.query(
      'SELECT owner FROM playlists WHERE id = $1',
      [playlistId]
    );

    if (result.rows.length === 0) {
      throw new Error('Playlist tidak ditemukan');
    }

    if (result.rows[0].owner !== owner) {
      throw new Error('Anda tidak memiliki izin untuk mengakses playlist ini');
    }
  }

  async deletePlaylist(playlistId) {
    await this._pool.query('DELETE FROM playlists WHERE id = $1', [playlistId]);
  }

  async verifySongAvailability(songId) {
    const result = await this._pool.query(
      'SELECT id FROM songs WHERE id = $1',
      [songId]
    );

    if (result.rows.length === 0) {
      throw new Error('Lagu tidak ditemukan');
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    await this._pool.query(
      'INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2)',
      [playlistId, songId]
    );
  }

  async getPlaylistById(playlistId) {
    const result = await this._pool.query(
      'SELECT playlists.id, playlists.name, users.username FROM playlists JOIN users ON playlists.owner = users.id WHERE playlists.id = $1',
      [playlistId]
    );

    if (result.rows.length === 0) {
      throw new Error('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async getSongsFromPlaylist(playlistId) {
    const result = await this._pool.query(
      'SELECT songs.id, songs.title FROM songs JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1',
      [playlistId]
    );
    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    await this._pool.query(
      'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      [playlistId, songId]
    );
  }
}

module.exports = PlaylistsService;
