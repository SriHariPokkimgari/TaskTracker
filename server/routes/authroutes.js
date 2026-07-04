import { Router } from "express";
import User from "../models/Auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required!" });
    }

    const resultUser = await User.find({ email });
    if (!resultUser || resultUser.length === 0) {
      return res.status(400).json({ message: "Email or Password incorrect." });
    }

    const user = resultUser[0];
    const passCheck = await bcrypt.compare(password, user.password);
    if (!passCheck)
      return res.status(400).json({ message: "Email or Password incorrect." });

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60,
      sameSite: "none",
    });
    res.status(200).json({ message: "Login success." });
  } catch (error) {
    console.log("Login error", error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, password are required" });
    }

    const isExist = await User.find({ email });
    if (isExist.length > 0) {
      return res
        .status(400)
        .json({ message: "Email aready used. Try another one or login" });
    }

    const hashPass = await bcrypt.hash(password, 12);

    const user = await new User({
      username: username,
      email: email,
      password: hashPass,
    });

    const savedUser = await user.save();

    const token = await jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60,
      sameSite: "none",
    });

    res.status(200).json({
      message: "Account creation successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

import { authMiddleware } from "../middleware/authMiddleware.js";

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Me error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
  });
  return res.status(200).json({ message: "Logout success." });
});

export default router;
