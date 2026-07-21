const jwt = require('jsonwebtoken');

const authMiddleware = (req, resp, next) => {
	const authHeader = req.headers.authorization;
	// console.log(authHeader);
	if(!authHeader) return resp.status(401).json({message: 'No Token Provided'});
	const token = authHeader.split(' ')[1];
	try{
		const decode = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decode;
		next();
	}
	catch(err){
		resp.status(403).json({message: 'Invalid Token'});
	}
}

module.exports = authMiddleware;