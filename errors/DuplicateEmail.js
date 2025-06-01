class DupLicateEmail extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 11000;
  }
}

module.exports = DupLicateEmail;