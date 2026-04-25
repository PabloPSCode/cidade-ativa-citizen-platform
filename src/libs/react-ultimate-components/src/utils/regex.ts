const numbersRegex = /[0-9]/;
const lowerCaseRegex = /[a-z]/;
const upperCaseRegex = /[A-Z]/;
const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
const birthDateValidationRegex =
  /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
const cpfValidationRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const phoneValidationRegex = /^\+55\d{10,11}$/;
const phoneWithoutCountryCodeValidationRegex = /\d{10,11}$/;
const phoneInputValidationRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
const maskedPhoneValidationRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;

export {
  birthDateValidationRegex,
  cpfValidationRegex,
  lowerCaseRegex,
  maskedPhoneValidationRegex,
  numbersRegex,
  phoneInputValidationRegex,
  phoneValidationRegex,
  phoneWithoutCountryCodeValidationRegex,
  specialCharacterRegex,
  upperCaseRegex,
};