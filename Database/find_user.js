const pool = require('./database');

const findToken = async function(refreshToken) {
  try {
    // Check if the refresh token exists
    const result = await pool.query(
      'SELECT refreshtoken FROM user_session WHERE  AND refreshToken = ?',
      [refreshToken]
    );
    
    if (result.length > 0) {
      // If the refresh token exists,
      return result[0];
    }
  } catch(err) {
    console.log(err);
    throw err; // Throw the error to be handled by the caller
  }
};

module.exports = findToken;

