import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET is not set");

export function signToken(user) {
  return jwt.sign({ sub: user.idUser, username: user.useName }, secret, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
}

export function verifyToken(req, res, next) {
  const [scheme, token] = (req.header("Authorization") || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Access denied" });
  }
  try {
    req.user = jwt.verify(token, secret, { algorithms: ["HS256"] });
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    res.status(401).json({ message });
  }
}
