const Joi = require("joi");
const Boom = require('@hapi/boom'); // Import Boom

const validateAlbum = () => ({
        payload: Joi.object({
          name: Joi.string().required(),
          year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
        }).min(1),
        failAction: (request, h, error) => {
          const response = Boom.badRequest(error.details.map((detail) => detail.message).join(', '));
          response.output.payload = {
            status: 'fail',
            message: error.details.map((detail) => detail.message).join(', '),
          };
          return response;
        },
      })

module.exports = {validateAlbum}