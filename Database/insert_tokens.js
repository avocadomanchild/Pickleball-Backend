// const pool = require('../Database/database');


// const insertRefreshToken = async function insertRefreshToken(username,assword) {
//   const [result] = await pool.query(`
//   INSERT INTO users_info (username,email,password)
//   VALUES (?,?,?)
//   `, [username,email,password])
//   const id = result.insertId
//   return getNote(id)
// }


// export const insertRefreshToken = async function(username, password,refreshToken) {
//   try
//   { const [result] = await pool.query(`INSERT INTO users_info (username,password,refreshToken) VALUES (?,?,?)`,
//   [username,password,refreshToken])
//   } catch(err){
//     console.log(err)
//     res.status(400)
//   }
// };

// module.exports = insertRefreshToken

const pool = require('./database') // Assuming a database connection is established in './database'
// const pool = require('../Database/database');
const insertRefreshToken = async function(username, password, refreshToken) {
  try {
    const [users] = await pool.query(`SELECT password,username FROM user_session WHERE username = ? `, [username]) 
    if (users.length > 0) {
      // Values exist in rows
      console.log('Values found:', users[0]);
      await pool.query(
        'UPDATE user_session SET refreshToken = ? WHERE username = ?',[refreshToken, username]
          );    

    } else {

      await pool.query(
        'INSERT INTO user_session (username, password, refreshToken) VALUES (?, ?, ?)',
        [username, password, refreshToken]
      );
      
    }
  } catch(err) {
    console.log(err);
    throw err; // Throw the error to be handled by the caller
  }
};

module.exports = insertRefreshToken;
