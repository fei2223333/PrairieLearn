const base32 = require('base32');
const OTPAuth = require('otpauth');

const accessMap = {};

module.exports.generateTOTP = function (assessmentId) {
  const genRanHex = (size) =>
    [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  const totp = new OTPAuth.TOTP({
    issuer: 'ACME',
    label: 'AzureDiamond',
    algorithm: 'SHA256',
    digits: 6,
    period: 300,
    secret: OTPAuth.Secret.fromHex(genRanHex(15)),
  });
  accessMap[assessmentId] = totp;
};

module.exports.validate = function (assessmentId, accessCode) {
  return accessMap[assessmentId].validate({ token: accessCode, window: 1 }) !== null;
};

module.exports.generateToken = function (assessmentId) {
  console.log(JSON.stringify(accessMap, null, 4));
  return accessMap[assessmentId].generate();
};
