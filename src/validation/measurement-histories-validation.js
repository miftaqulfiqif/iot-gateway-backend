export const createMeasurementHistoryValidation = Joi.object({
  device_type_id: Joi.string().max(100).required(),
  data: Joi.object().required(),
});
