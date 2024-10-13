const pool = require('../../database');
const bcrypt = require('bcrypt');
const randToken = require('rand-token');
const jwtVariable = require('../../variable/jwt');
const accountMethod = require('./account.method')

// Register account
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
        return res.status(200).json({
            success: true,
            message: 'Account registered successfully!'
        });
    } catch (error) {
        console.error('Registation Error: ', error);
        return res.status(500).json({
            success: false,
            message: 'An error occured during account registration!'
        });
    }
}


// Login 
exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Check user existance
        const userResult = await pool.query(
            `SELECT password, refresh_token FROM account.account WHERE username = $1`,
            [username]
        )
        if (userResult.rows.length <= 0) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = userResult.rows[0];
        // Check password
        const isPaswordValid = bcrypt.compareSync(password, user.password);
        if (!isPaswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Password incorrect'
            });
        }

        // Token process
            // Token parameters
        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const accessTokenData = { username: username };

            // Create access token
        const accessToken = await accountMethod.generateToken(
            accessTokenData,
            accessTokenSecret,
            accessTokenLife
        );
    
        if(!accessToken) {
            return res.status(400).json({
                success: false,
                message: 'Login failed!'
            })
        }

        // Create refresh token
        let refreshToken = randToken.generate(jwtVariable.refreshTokenSize);

        if (!user.refresh_token) {
            await pool.query(
                `UPDATE account.account
                 SET refresh_token = $1
                 WHERE username = $2`,
                [refreshToken, username]
            );
        } else {
            refreshToken = user.refresh_token;
        }
        

        return res.status(200).json({
            success: true,
            message: 'Login successfully',
            accessToken: accessToken,
            refreshToken: refreshToken,
        })
    } catch (error) {
        console.error('Login error: ', error);
        return res.status(500).json({
            success: false,
            message: 'An error occured during login!'
        });
    }
}

// Refresh the access token
exports.refreshToken = async (req, res) => {
    // Get current access token from header
    const accessTokenFromHeader = req.headers.x_authorization;
    if(!accessTokenFromHeader) {
        return res.status(400).json({
            success: false,
            message: "Access Token not found!"
        });
    }

    // Get refresh token
    const refreshTokenFromBody = req.body.refreshToken;
    if(!refreshTokenFromBody) {
        return res.status(400).json({
            success: false,
            message: "Refresh Token not found!"
        });
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

    // Decode access token
    const decoded = await accountMethod.decodeToken(
        accessTokenFromHeader,
        accessTokenSecret
    );
    if(!decoded) {
        return res.status(400).json({
            success: false,
            message: "Access Token not valid!"
        });
    }

    const username = decoded.payload.username;

    const userResult = await pool.query(
        `SELECT refresh_token FROM account.account WHERE username = $1`,
            [username]
    );

    if(userResult.rows.length <= 0) {
        return res.status(400).json({
            success: false,
            message: "User not found!"
        });
    }

    // Check refresh token
    const user = userResult.rows[0];

    if(refreshTokenFromBody !== user.refresh_token) {
        return res.status(400).json({
            success: false,
            message: "Refresh Token not valid!"
        });
    }

    // Create new access token
    const accessTokenData = { username };
    const accessToken = await accountMethod.generateToken(
        accessTokenData,
        accessTokenSecret,
        accessTokenLife
    );

    if(!accessToken) {
        return res.status(400).json({
            success: false,
            message: "Error when creating access token!"
        });
    }

    return res.json({
        success: true,
        accessToken: accessToken
    })
}

// Add or update FCM token for Firebase messaging service
exports.updateFCMToken = async (req, res) => {
    const { fcmToken, userId } = req.body;

    // Input validation
    if (!fcmToken || !userId) {
        return res.status(400).json({
            success: false,
            message: "fcmToken and userId are required!"
        });
    }

    try {
        const updateResult = await pool.query(
            `UPDATE account.account 
             SET fcm_token = $1 
             WHERE id = $2`,
             [fcmToken, userId]
        );

        // Check if the update actually modified any rows
        if (updateResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found or token already up-to-date!"
            });
        }

        res.status(200).json({
            success: true,
            message: "FCM token updated successfully!"
        });
    } catch (error) {
        console.error("FCM update error: ", error);
        return res.status(500).json({
            success: false,
            message: "Error when updating FCM token!"
        });
    }
};
