const jwt = require("jsonwebtoken");

async function GenerateToken(userData) {
  try {
    const expireAt = 90 * 24 * 60 * 60;
    // console.log("expireAt", expireAt);
    const token = jwt.sign(
      { _id: userData._id, branchId: userData.branch_id, school_id: userData.school_id, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: expireAt }
    );
    // console.log("token is", token);
    const expireDate = new Date(Date.now() + expireAt * 1000);
    return { token, expireDate };
  } catch (error) {
    throw error;
  }
}

module.exports = GenerateToken;
