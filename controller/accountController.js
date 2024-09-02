const pool = require('../database');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const { username, password, email, name, age } = req.body;

    try {
        // Validate input
        if (!username || !password || !email || !name || !age) {
            return res.status(406).json({
                success: false,
                message: 'All fields are required to resgister!'
            });
        }

        // Check existed username
        const userCheck = await pool.query(
            `SELECT id FROM account.account WHERE username = $1`,
            [username]
        );

        if (userCheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert to database
        const result = await pool.query(
            `INSERT INTO account.account (username, password, email, name, age)
            VALUES ($1, $2, $3, $4, $5)`,
            [username, hashedPassword, email, name, age]
        );

        // If success
        res.status(200).json({
            success: true,
            message: 'Account registered successfully!'
        });
        client.release();
    } catch (error) {
        console.error('Registation Error: ', error);
            res.status(500).json({
                success: false,
                message: 'An error occured during account registration!'
            });
    }
}


// Login 
exports.login = (req, res) => {
    res.send("oke")
}