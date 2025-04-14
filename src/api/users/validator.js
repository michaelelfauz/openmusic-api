const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const validateUserPayload = (payload) => {
  const result = UserPayloadSchema.validate(payload);
  if (result.error) {
    throw new Error(result.error.message);
  }
};

const validatePostAuthenticationPayload = (payload) => {
  const result = PostAuthenticationPayloadSchema.validate(payload);
  if (result.error) {
    throw new Error(result.error.message);
  }
};

const validatePutAuthenticationPayload = (payload) => {
  const result = PutAuthenticationPayloadSchema.validate(payload);
  if (result.error) {
    throw new Error(result.error.message);
  }
};

const validateDeleteAuthenticationPayload = (payload) => {
  const result = DeleteAuthenticationPayloadSchema.validate(payload);
  if (result.error) {
    throw new Error(result.error.message);
  }
};

module.exports = {
  validateUserPayload,
  validatePostAuthenticationPayload,
  validatePutAuthenticationPayload,
  validateDeleteAuthenticationPayload,
};