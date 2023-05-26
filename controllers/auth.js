const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  try {
    // const isUserExist = await User.findOne({ email: req.body.email });
    // if (isUserExist)
    //   return res.send(400).json({
    //     msg: "User with this email already exists",
    //   });

    const user = await User.create({ ...req.body });

    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password!");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("User doesn't exist!");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Provided password is wrong!");
  }
  const token = user.createJWT();
  console.log(err);
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
