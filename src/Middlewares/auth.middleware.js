import jwt from "jsonwebtoken";
import { User } from "../../DB/models/index.js";
/**
 * destructuting token from request headers
 * check if there is a token or not
 * check if the token starts with prefix or not
 * split the token
 * decode the token and verify the data
 * check if the token have the user id
 * find user by his id to get latest new data for user without password
 * check if user is found
 * send user data in the request
 */
export const authenticate = () => {
  return async (req, res, next) => {
    try {
      // destructuting token from request headers
      const { token } = req.headers;
      // check if there is a token or not
      if (!token)
        return res
          .status(400)
          .json({ message: "Please signIn first there is no token" });
      // check if the token starts with prefix or not
      if (!token.startsWith(process.env.PREFIX_SECRET_WORD))
        return res.status(400).json({ message: "Invalid token" });
      // split the token
      const originToken = token.split(" ")[1];
      // decode the token and verify the data
      const decodedData = jwt.verify(originToken, process.env.LOGIN_SECRET);
      // check if the token have the user id
      if (!decodedData?.userId)
        return res.status(400).json({ message: "Invalid token payload" });
      // find user by his id to get latest new data for user without password
      const user = await User.findById(decodedData.userId).select("-password");
      // check if user is found
      if (!user)
        return res
          .status(404)
          .json({ message: "User not found, Please signUp" });
      // send user data in the request
      req.authUser = user;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};
