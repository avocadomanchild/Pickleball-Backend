// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

// const handleNewUser = async (req, res) => {
//     const { user, pwd } = req.body;
//     if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
//     // check for duplicate usernames in the db
//     const duplicate = usersDB.users.find(person => person.username === user);
//     if (duplicate) return res.sendStatus(409); //Conflict 
//     try {
//         //encrypt the password
//         const hashedPwd = await bcrypt.hash(pwd, 10);
//         //store the new user
//         const newUser = { "username": user, "password": hashedPwd };
//         usersDB.setUsers([...usersDB.users, newUser]);
//         await fsPromises.writeFile(
//             path.join(__dirname, '..', 'model', 'users.json'),
//             JSON.stringify(usersDB.users)
//         );
//         console.log(usersDB.users);
//         res.status(201).json({ 'success': `New user ${user} created!` });
//     } catch (err) {
//         res.status(500).json({ 'message': err.message });
//     }
// }

// module.exports = { handleNewUser };


const pool = require('../Database/database');

const handleNewUser = async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ 'message': 'Username, email, and password are required.' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10 )
      const [result] = await pool.query(`
        INSERT INTO users_info (username, email, password)
        VALUES (?, ?, ?)
      `, [username, email, hashedPassword]);
  
      const newEmployee = {
        id: result.insertId,
        username,
        email,
        password,
      };
      console.log("One record has been posted");
      res.status(201).json(newEmployee);
    } catch (error) {
      console.error(error);
    //   res.status(500).json({ 'message': 'An error occurred while creating the new employee.' });
      res.status(400).send({ error: error.message });
    }
  };
  

  module.exports = { handleNewUser };
