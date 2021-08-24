import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from 'vee-validate';
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minValue,
  max_value as maxValue,
  confirmed,
  not_one_of as excluded,
  alpha_num as alphaNum,
} from '@vee-validate/rules';

export default {
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);
    // Rules
    defineRule('required', required);
    defineRule('tos', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('email', email);
    defineRule('min_value', minValue);
    defineRule('max_value', maxValue);
    defineRule('passwords_mismatch', confirmed);
    defineRule('excluded', excluded);
    defineRule('country_excluded', excluded);
    defineRule('date_between', (value) => {
      // Validate year makes sense [year, month, day]
      const parseDate = value.split('-');
      const yy = Number(parseDate[0]);
      return yy > 1921 && yy < new Date().getFullYear() - 18;
    });
    defineRule('alpha_num', alphaNum);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `The field ${ctx.field} is required.`,
          min: `The field ${ctx.field} is too short.`,
          max: `The field ${ctx.field} is too long.`,
          alpha_spaces: `The field ${ctx.field} may only contain alphabetic characters and spaces.`,
          email: `The field ${ctx.field} must be a valid email.`,
          min_value: `The field ${ctx.field} is too low.`,
          max_value: `The field ${ctx.field} is too high.`,
          confirmed: `The field ${ctx.field} is required.`,
          excluded: `You are not allowed to use this value for the field ${ctx.field}.`,
          country_excluded: `Due to restrictions, we do not accept users from this location.`,
          passwords_mismatch: `The passwords don't match.`,
          tos: `You must accept the terms of service.`,
          date_between: `The birthday is invalid.`,
          alpha_num: `The field ${ctx.field} must contain only alpha-numeric characters.`,
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The field ${ctx.field} is invalid.`;

        return message;
      },
      // These are the default values, can be omitted
      // Validate on every blur event
      validateOnBlur: true,
      // Validate on every change event
      validateOnChange: true,
      // Validated on every key stroke, too excessive
      validateOnInput: false,
      // validate the input when the value changes internally
      validateOnModelUpdate: true,
    });
  },
};
