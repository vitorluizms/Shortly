import joi from "joi";

export const signUpSchema = joi.object({
  name: joi.string().invalid("name").required(),
  email: joi.string().email().invalid("email").required(),
  password: joi.string().invalid("password").required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required(),
});

export const signInSchema = joi.object({
  email: joi.string().email().invalid("email").required(),
  password: joi.string().invalid("password").required(),
});

export const urlSchema = joi.object({
  url: joi
    .string()
    .uri({ scheme: ["https, http"] })
    .required(),
});
