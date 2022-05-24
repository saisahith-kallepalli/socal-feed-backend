const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const jwtToken = require("jsonwebtoken");
secret_key = process.env.secret_key;

//we r checking wether the gmail of the user is exists or not
const googleAuth = async (idToken, next) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      requiredAudience: process.env.CLIENT_ID,
    });
    const { email } = ticket.getPayload();
    return email;
  } catch (error) {
    next(error);
  }
};
//It will generate jet-token for user
const getToken = (user) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0);
  const exp = tomorrow.getTime() - today.getTime();
  return jwtToken.sign(
    {
      id: user._id,
      email: user.email,
      name: user.firstName,
      lastName: user.lastName,
    },
    secret_key,
    { expiresIn: exp / 1000 }
  );
};
module.exports = { googleAuth };
