const jwt=require("jsonwebtoken");

function GenerateInviteCode(userId){
    try{
        const expireAt=7*24*60*60;
        const invite_code=jwt.sign({userId:userId}, process.env.JWT_SECRET,
      { expiresIn: expireAt })

        return invite_code;
    }catch(error)
    {
        throw error;
    }
}
module.exports=GenerateInviteCode;
