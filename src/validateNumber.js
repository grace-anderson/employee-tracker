function validateNumber(value) {
  const validRegex = /^\d+$/;

  return validRegex.test(value);
}

module.exports = {
  validateNumber
};
