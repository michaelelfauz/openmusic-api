const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getUserPlaylistsHandler = this.getUserPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

      const response = h.response({
        status: 'success',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  async getUserPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getUserPlaylists(credentialId);
    return {
      status: 'success',
      data: { playlists },
    };
  }

  async deletePlaylistByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylist(id);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  _handleError(error, h) {
    if (error instanceof ClientError) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(error.statusCode);
      return response;
    }

    const response = h.response({
      status: 'error',
      message: 'Maaf, terjadi kesalahan pada server kami.',
    });
    response.code(500);
    console.error(error);
    return response;
  }
}

module.exports = PlaylistsHandler;
