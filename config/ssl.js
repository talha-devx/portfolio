// config/ssl.js
// SSL settings for MySQL. Cloud databases (e.g. TiDB Cloud, Aiven) require an encrypted connection.
//   DB_SSL    = "true" to encrypt and verify the server with the usual public certificates
//               (works for TiDB Cloud and most cloud databases)
//   DB_SSL_CA = contents of a CA certificate (ca.pem), only if your provider gives you one
// Leave both empty for a local MySQL on your own computer.

function getSSLConfig() {
  if (process.env.DB_SSL_CA) {
    // Some dashboards store the certificate on one line with "\n" instead of real line breaks
    return { ca: process.env.DB_SSL_CA.replace(/\n/g, '\n'), rejectUnauthorized: true };
  }
  if (process.env.DB_SSL === 'true') {
    return { minVersion: 'TLSv1.2', rejectUnauthorized: true };
  }
  return undefined;
}

module.exports = { getSSLConfig };
