const User = require("../models/User");

const loginWithGoogle = async (profile) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (user) {
      user.lastActiveAt = Date.now();
      user.isActive = true;
      await user.save();
    } else {
      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        password: "@12345Google",
        isActive: true,
      });

      await user.save();
    }

    return { success: true, data: user };
  } catch (error) {
    console.error(
      "Xảy ra lỗi server trong quá trình đăng nhập bằng Google:",
      error
    );
    return {
      success: false,
      message: `Xảy ra lỗi server trong quá trình đăng nhập bằng Google: ${error}`,
    };
  }
};

module.exports = {
  loginWithGoogle,
};
