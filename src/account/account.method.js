const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

// Access Token generator
exports.generateToken = async (payload, secretSignature, tokenLife) => {
    try {
        return await sign(
            { payload },
            secretSignature,
            {
                algorithm: 'HS256',
                expiresIn: tokenLife
            }
        );
    } catch (error) {
        console.log('Generate access token error: ', error);
        return null;
    }
}

// Decode access token
exports.decodeToken = async (token, secretKey) => {
    try {
        return await verify(token, secretKey, { ignoreExpiration: true });
    } catch (error) {
        console.log('Decode Access Token error: ', error);
        return null;
    }
}

// Verify access token
exports.verifyToken = async (token, secretKey) => {
	try {
		return await verify(token, secretKey);
	} catch (error) {
		console.log(`Error in verify access token:  + ${error}`);
		return null;
	}
};