async function GeneratePassword(length=10)
{

    const chars='abcdefghijklmnopqrswxyz1234567890!@#$%^&*';
    let password="";
    for(let i=0;i<=length;i++)
    {
        password+=chars.charAt(Math.floor(Math.random()*chars.length))
    }
    return password;
}

module.exports=GeneratePassword;