const Redis = require("ioredis");

const redis = new Redis({
  host: "localhost",
  port: 6379,
});

async function setRedisData(key, value, ttlInSeconds = 60) {
  try {
    let valueToStore;
    if (value && typeof value === "object") {
      valueToStore = JSON.stringify(value);
    } else {
      valueToStore = value.toString();
    }

    await redis.setex(key, ttlInSeconds, valueToStore);
    return {
      success: true,
      message: `Dữ liệu đã được lưu vào Redis: ${key} = ${valueToStore}`,
      data: valueToStore,
    };
  } catch (error) {
    return {
      success: false,
      message: `Lỗi khi lưu dữ liệu vào Redis: ${error.message}`,
    };
  }
}

async function getRedisData(key) {
  try {
    const value = await redis.get(key);
    if (value) {
      try {
        const parsedValue = JSON.parse(value);
        return {
          success: true,
          message: `Dữ liệu được lấy từ Redis: ${key} = ${JSON.stringify(
            parsedValue
          )}`,
          data: parsedValue,
        };
      } catch (err) {
        return {
          success: true,
          message: `Dữ liệu được lấy từ Redis: ${key} = ${value}`,
          data: value,
        };
      }
    } else {
      return {
        success: false,
        message: `Dữ liệu đã hết hạn hoặc không tìm thấy từ khóa ${key} trong Redis`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Lỗi khi lấy dữ liệu từ Redis: ${error.message}`,
    };
  }
}

async function deleteRedisData(key) {
  try {
    const result = await redis.del(key);
    if (result) {
      return {
        success: true,
        message: `Đã xóa dữ liệu cho khóa: ${key}`,
      };
    } else {
      return {
        success: false,
        message: `Không có dữ liệu để xóa cho khóa: ${key}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Lỗi khi xóa dữ liệu: ${error.message}`,
    };
  }
}

async function closeRedisConnection() {
  try {
    await redis.quit();
    return {
      success: true,
      message: "Kết nối Redis đã đóng",
    };
  } catch (error) {
    return {
      success: false,
      message: `Lỗi đóng kết nối Redis: ${error.message}`,
    };
  }
}

module.exports = {
  setRedisData,
  getRedisData,
  deleteRedisData,
  closeRedisConnection,
};
