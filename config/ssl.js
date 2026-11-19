// config/ssl.js
// SSL settings for MySQL. Cloud databases (e.g. Aiven) require an encrypted connection.
//   DB_SSL_CA = contents of the CA certificate (ca.pem) from your database provider (recommended)
//   DB_SSL    = "true" to encrypt without checking the certificate (fallback if you have no CA)
// Leave both empty for a local MySQL on your own computer.

function getSSLConfig() {
  if (process.env.DB_SSL_CA) {
    // Some dashboards store the certificate on one line with "\n" instead of real line breaks
    return { ca: process.env.DB_SSL_CA.replace(/\n/g, '\n'), rejectUnauthorized: true };
  }
  if (process.env.DB_SSL === 'true') {
    return { rejectUnauthorized: false };
  }
  return undefined;
}

module.exports = { getSSLConfig };
