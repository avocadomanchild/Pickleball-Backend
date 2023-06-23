// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }
const fsPromises = require('fs').promises;
const path = require('path');
const pool = require('../Database/database');
const inserttokens = require('../Database/insert_tokens')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const handleLogin = async (req, res) => {
    const {username,password} = req.body;
    // if (!username || !password) return res.status(400).send({ 'message': 'Username and password are required.' });
    
    
    const [rows] = await pool.query(`SELECT password,username FROM users_info WHERE username = ? `, [username])
    console.log(rows)
    if (rows.length === 0) {
        return res.status(400).send("Invalid Username");
    }
    const username_query = rows[0].username;
    const passwordHash = rows[0].password;
    const match = await bcrypt.compare(password, passwordHash);
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            { "username": username_query  },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1hr' }
        );
        const refreshToken = jwt.sign(
            { "username": username_query  },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // to do 
        // Saving refreshToken with current user
        // inserting into databse refresh token 
        // check if user is already in databse else insert into database 
        // to do  check if user is already in this table then just update into the table the resfresh token or insert the password user name and 
        inserttokens(username_query,passwordHash,refreshToken)
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        // console.log()
        res.json({ accessToken });
    } else {
        // res.sendStatus(401);
        console.log("here")
        res.status(400).send("Invalid Password");

    }
}




module.exports = { handleLogin };