// const pool = require('./database') // Assuming a database connection is established in './database'
// // const pool = require('../Database/database');
// const delete_token = async function(username) {
//   try {
//     await pool.query(
//       'DELETE FROM refreshToken WHERE USERNAME =  VALUES ?',
//       [username]
//     );
//   } catch(err) {
//     console.log(err);
//     throw err; // Throw the error to be handled by the caller
//   }
// };

// module.exports = delete_token ;

const pool = require('./database');

const delete_token = async function(username, refreshToken) {
  try {
    // Check if the refresh token exists
    const result = await pool.query(
      'SELECT * FROM user_session  WHERE USERNAME = ? AND refreshToken = ?',
      [username, refreshToken]
    );
    
    if (result.length > 0) {
      // If the refresh token exists, delete it
      await pool.query(
        'DELETE FROM user_session WHERE USERNAME = ? AND refreshToken = ?',
        [username, refreshToken]
      );
      console.log(`Refresh token deleted for user ${username}`);
    } else {
      // If the refresh token does not exist, log an error message
      console.log(`Refresh token not found for user ${username}`);
    }
  } catch(err) {
    console.log(err);
    throw err; // Throw the error to be handled by the caller
  }
};

module.exports = delete_token;

