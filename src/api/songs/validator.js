const Joi = require('joi');
const Boom = require('@hapi/boom');

const validateSong = () => ({
  payload: Joi.object({
    title: Joi.string().required().messages({
      'string.base': 'Judul lagu harus berupa teks',
      'any.required': 'Judul lagu harus diisi',
    }),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required().messages({
      'number.base': 'Tahun lagu harus berupa angka',
      'any.required': 'Tahun lagu harus diisi',
      'number.min': 'Tahun lagu tidak boleh kurang dari 1900',
      'number.max': `Tahun lagu tidak boleh lebih dari ${new Date().getFullYear()}`,
    }),
    genre: Joi.string().required().messages({
      'string.base': 'Genre lagu harus berupa teks',
      'any.required': 'Genre lagu harus diisi',
    }),
    performer: Joi.string().required().messages({
      'string.base': 'Penyanyi lagu harus berupa teks',
      'any.required': 'Penyanyi lagu harus diisi',
    }),
    duration: Joi.number().integer().optional().allow(null).messages({
      'number.base': 'Durasi lagu harus berupa angka',
    }),
    albumId: Joi.string().optional().allow(null).messages({
      'string.base': 'ID album harus berupa string',
    }),
  }),
  failAction: (request, h, error) => {
    const response = Boom.badRequest(error.details.map(d => d.message).join(', '));
    response.output.payload = {
      status: 'fail',
      message: error.details.map(d => d.message).join(', '),
    };
    return response;
  },
});

module.exports = { validateSong };
