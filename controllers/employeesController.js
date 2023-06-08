const pool = require('../Database/database');

const data = {
    employees: require('../model/employees.json'),
    setEmployees: function (data) { this.employees = data }
}

const getAllEmployees = (req, res) => {
    res.json(data.employees);
}

const createNewEmployee = async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ 'message': 'Username, email, and password are required.' });
    }
  
    try {
      const [result] = await pool.query(`
        INSERT INTO users_info (username, email, password)
        VALUES (?, ?, ?)
      `, [username, email, password]);
  
      const newEmployee = {
        id: result.insertId,
        username,
        email,
        password,
      };
  
      res.status(201).json(newEmployee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ 'message': 'An error occurred while creating the new employee.' });
    }
  };
  

// const createNewEmployee = (req, res) => {
//     const newEmployee = {
//         id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1,
//         firstname: req.body.firstname,
//         lastname: req.body.lastname
//     }

//     if (!newEmployee.firstname || !newEmployee.lastname) {
//         return res.status(400).json({ 'message': 'First and last names are required.' });
//     }

//     data.setEmployees([...data.employees, newEmployee]);
//     res.status(201).json(data.employees);
// }
const Login = async (req, res) => {
    const { username,  password } = req.body;
    const [rows] = await pool.query(`SELECT password FROM users_info WHERE username = ? `, [username])
    return rows[0]
}

// async function Login(username) {
//     const [rows] = await pool.query(`SELECT password FROM users_info WHERE username = ? `, [username])
//     return rows[0]
//   }

const updateEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    }
    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname = req.body.lastname;
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, employee];
    data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.employees);
}

const deleteEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    }
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    data.setEmployees([...filteredArray]);
    res.json(data.employees);
}

const getEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.params.id} not found` });
    }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}