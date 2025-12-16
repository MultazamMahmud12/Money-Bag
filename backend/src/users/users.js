const User = require('./users.model');

const registerUser = async (req, res) => {
  try {
    const { firebaseUid, name, email } = req.body;

    if (!firebaseUid || !name || !email) {
      return res.status(400).json({ 
        message: 'All fields are required: firebaseUid, name, email' 
      });
    }

    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists' 
      });
    }

    const newUser = new User({ firebaseUid, name, email });
    await newUser.save();

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: newUser 
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
};

module.exports = { registerUser };