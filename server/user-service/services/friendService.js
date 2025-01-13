const axios = require("axios");

const fetchConnectFriends = async (userId) => {
  try {
    const response = await axios.get(
      `${process.env.BASE_URL}/api/friends/friend/connectFriends/${userId}`
    );

    if (response.data.success) {
      return {
        success: true,
        status: 200,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      return {
        success: false,
        status: response.data.status,
        message: response.data.message,
      };
    }
  } catch (error) {
    console.log(
      `Xảy ra lỗi server khi lấy danh sách người dùng liên quan: ${error.message}`
    );
    return {
      success: false,
      status: 500,
      message: `Xảy ra lỗi server khi lấy danh sách người dùng liên quan: ${error.message}`,
    };
  }
};

module.exports = { fetchConnectFriends };