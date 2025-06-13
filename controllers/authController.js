const authService = require('../services/authService');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.signup({ name, email, password, role }, process.env.CLIENT_URL);
    res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await authService.verifyEmail(req.params.token);
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const token = await authService.login(req.body);
    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: err.message });
  }
};