// const { nanoid } = require('nanoid'); // Hapus baris ini
const { InvariantError } = require('../../exceptions');
const NotFoundError = require('../../exceptions/NotFoundError');
const SongsService = require('../../services/postgres/SongsService');
const SongsValidator = require('./validator');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getAllSongsHandler = this.getAllSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) { // Tambahkan async di sini
    try {
      this._validator.validatePostSongPayload(request.payload);
      const { title, year, genre, performer, duration, albumId } = request.payload;
      const { nanoid } = await import('nanoid'); // Gunakan dynamic import

      const songId = await this._service.addSong({ id: `song-${nanoid(16)}`, title, year, genre, performer, duration, albumId }); // Asumsi service menerima id

      const response = h.response({
        status: 'success',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof InvariantError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getAllSongsHandler(request, h) {
    try {
      const { title, performer } = request.query;
      const songs = await this._service.getAllSongs({ title, performer });
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundError) { // Gunakan NotFoundError
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      if (error instanceof InvariantError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validatePutSongPayload(request.payload);
      const { id } = request.params;
      const { title, year, genre, performer, duration, albumId } = request.payload;

      await this._service.updateSongById(id, { title, year, genre, performer, duration, albumId });

      return {
        status: 'success',
        message: 'Lagu berhasil diperbarui',
      };
    } catch (error) {
      if (error instanceof InvariantError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      if (error instanceof NotFoundError) { // Tambahkan penanganan NotFoundError jika diperlukan di service
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof NotFoundError) { // Gunakan NotFoundError
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = (pool) => new SongsHandler(new SongsService(pool), SongsValidator);