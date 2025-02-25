import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (empId, res) => {
  const token = jwt.sign({ empId }, process.env.JWT_SECRET, {
    expiresIn: "15d"
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

export default generateTokenAndSetCookie;
