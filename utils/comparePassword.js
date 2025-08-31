const bcrypt = require('bcryptjs');
const comparePassword = async (hashedPassword, plainPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
}
module.exports = comparePassword;