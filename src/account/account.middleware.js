const accountMethod = require('./account.method');
const pool = require('../../database');

exports.isAuth = async (req, res, next) => {
    // Get access token from header
    const accessTokenFromHeader = req.headers.x_authorization;
    if(!accessTokenFromHeader) {
        return res.status(400).json({
            success: false,
            message: "Access Token not found!"
        });
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    // Verify the access token and decode the username
	const verified = await accountMethod.verifyToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	if (!verified) {
		return res.status(401).json({
            success: false,
            message: "Request not authorized!"
        });
	}

    const username = verified.payload.username;

    try {
        // Get user data
        const userResult = await pool.query(
            `SELECT * FROM account.account WHERE username = $1`,
            [username]
        )

        if (userResult.rows.length <= 0) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const user = userResult.rows[0];
        
        req.userData = user;
    } catch (error) {
        console.error('Auth error: ', error);
        return res.status(500).json({
            success: false,
            message: 'Authorization error!'
        })
    }
    return next();
}