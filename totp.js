const OTPAuth = require('otpauth');

const accessMap = {};

module.exports.generateTOTP = function (assessmentId) {
  const genRanHex = (size) =>
    [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  const secret = genRanHex(15);
  const totp = new OTPAuth.TOTP({
    issuer: 'ACME',
    label: 'AzureDiamond',
    algorithm: 'SHA256',
    digits: 6,
    period: 300,
    secret: OTPAuth.Secret.fromHex(secret),
  });
  accessMap[assessmentId] = { totp, secret };
};

module.exports.validate = function (assessmentId, accessCode) {
  return accessMap[assessmentId].totp.validate({ token: accessCode, window: 1 }) !== null;
};

module.exports.generateToken = function (assessmentId) {
  return accessMap[assessmentId].totp.generate();
};

module.exports.getSecret = function (assessmentId) {
  return accessMap[assessmentId].secret;
};
