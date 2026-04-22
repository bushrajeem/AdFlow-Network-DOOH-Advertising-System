import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({
      message: "Signup Successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
       { expiresIn: "1d" });
       
    res.status(200).json({
      message: "Login Successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getUsers(req, res) {
  const users = await User.find().select("name email role phone avatar");
  res.json(users);
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found." });

    res.json({ message: "User deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
