const Joi = require('joi');

const PostSongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().integer().positive().allow(null), // Contoh duration boleh null
  albumId: Joi.string().allow(null), // Contoh albumId boleh null
});

const PutSongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().integer().positive().allow(null), // Contoh duration boleh null
  albumId: Joi.string().allow(null), // Contoh albumId boleh null
});

module.exports = { PostSongPayloadSchema, PutSongPayloadSchema };