import jwt from 'jsonwebtoken'

const generateTokenAndSetCookie = (empId, res) => {
    const token = jwt.sign({empId}, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })

    res.cookie("jwt", token, {
        maxAge: 15*24*60*60*1000, // MS
        httpOnly: true, // prevet XSS attacks cross-site scripting attacks
        sameSite:"strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NOODE_ENV !== "development",
    });
};

export default generateTokenAndSetCookie;