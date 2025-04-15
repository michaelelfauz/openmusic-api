const Joi = require('joi');
const Boom = require('@hapi/boom');

const validateAlbum = () => ({
  payload: Joi.object({
    name: Joi.string().required().messages({
      'string.base': 'Nama album harus berupa teks',
      'any.required': 'Nama album harus diisi',
    }),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required().messages({
      'number.base': 'Tahun album harus berupa angka',
      'any.required': 'Tahun album harus diisi',
      'number.min': 'Tahun album tidak boleh kurang dari 1900',
      'number.max': `Tahun album tidak boleh lebih dari ${new Date().getFullYear()}`,
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

module.exports = { validateAlbum };
