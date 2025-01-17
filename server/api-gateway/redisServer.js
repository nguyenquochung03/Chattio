const Redis = require("ioredis");
const flatted = require("flatted");
require("dotenv").config();

const redisClusterNodes = [
  { port: 8000, host: "127.0.0.1", password: process.env.REDIS_PASSWORD },
  { port: 8001, host: "127.0.0.1", password: process.env.REDIS_PASSWORD },
  { port: 8002, host: "127.0.0.1", password: process.env.REDIS_PASSWORD },
  { port: 8003, host: "127.0.0.1", password: process.env.REDIS_PASSWORD },
  { port: 8004, host: "127.0.0.1", password: process.env.REDIS_PASSWORD },
  { port: 8005, host: "127.0.0.1", password: process.env.REDIS_PASSWORD },
];

const redisCluster = new Redis.Cluster(redisClusterNodes, {
  redisOptions: {
    password: process.env.REDIS_PASSWORD,
  },
});

/////// Các hàm cơ bản của REDIS CLUSTER
async function setRedisData(key, value, ttlInSeconds = 86400) {
  try {
    let valueToStore;
    if (value && typeof value === "object") {
      valueToStore = flatted.stringify(value);
    } else {
      valueToStore = value.toString();
    }

    await redisCluster.setex(key, ttlInSeconds, valueToStore);

    console.log(`Dữ liệu đã được lưu vào Redis: ${key}`);
    return {
      success: true,
      message: `Dữ liệu đã được lưu vào Redis: ${key}`,
      data: valueToStore,
    };
  } catch (error) {
    console.error(`Lỗi khi lưu dữ liệu vào Redis: ${error.message}`);
    return {
      success: false,
      message: `Lỗi khi lưu dữ liệu vào Redis: ${error.message}`,
    };
  }
}

async function getRedisData(key) {
  try {
    const value = await redisCluster.get(key);

    if (value) {
      try {
        const parsedValue = JSON.parse(value);
        console.log(`Dữ liệu được lấy từ Redis: ${key}`);
        return {
          success: true,
          message: `Dữ liệu được lấy từ Redis: ${key}`,
          data: parsedValue,
        };
      } catch (err) {
        console.log(`Dữ liệu được lấy từ Redis: ${key}`);
        return {
          success: true,
          message: `Dữ liệu được lấy từ Redis: ${key}`,
          data: value,
        };
      }
    } else {
      console.log(
        `Dữ liệu đã hết hạn hoặc không tìm thấy từ khóa ${key} trong Redis`
      );
      return {
        success: false,
        message: `Dữ liệu đã hết hạn hoặc không tìm thấy từ khóa ${key} trong Redis`,
      };
    }
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu từ Redis: ${error.message}`);
    return {
      success: false,
      message: `Lỗi khi lấy dữ liệu từ Redis: ${error.message}`,
    };
  }
}

async function getAllUserSocketsKeys(preKey) {
  let cursor = "0";
  let userSocketKeys = [];

  try {
    do {
      const reply = await redisCluster.scan(
        cursor,
        "MATCH",
        preKey,
        "COUNT",
        100
      );
      cursor = reply[0];
      const keys = reply[1];

      if (keys.length > 0) {
        userSocketKeys.push(...keys);
      }
    } while (cursor !== "0");

    console.log(`Lấy tất cả các key bắt đầu với ${preKey} thành công.`);
    return {
      success: true,
      message: `Lấy tất cả các key bắt đầu với ${preKey} thành công.`,
      data: userSocketKeys,
    };
  } catch (error) {
    console.error(`Lỗi khi lấy key từ Redis: ${error.message}`);
    return {
      success: false,
      message: `Lỗi khi lấy key từ Redis: ${error.message}`,
    };
  }
}

async function deleteRedisData(key) {
  try {
    const result = await redisCluster.del(key);

    console.log(`Bắt đầu xóa dữ liệu cho ${key}`);
    if (result) {
      console.log(`Đã xóa dữ liệu cho khóa: ${key}`);
      return {
        success: true,
        message: `Đã xóa dữ liệu cho khóa: ${key}`,
      };
    } else {
      console.log(`Không có dữ liệu để xóa cho khóa: ${key}`);
      return {
        success: false,
        message: `Không có dữ liệu để xóa cho khóa: ${key}`,
      };
    }
  } catch (error) {
    console.error(`Lỗi khi xóa dữ liệu: ${error.message}`);
    return {
      success: false,
      message: `Lỗi khi xóa dữ liệu: ${error.message}`,
    };
  }
}

async function closeRedisConnection() {
  try {
    await redisCluster.quit();
    console.log("Kết nối Redis đã đóng");
    return {
      success: true,
      message: "Kết nối Redis đã đóng",
    };
  } catch (error) {
    console.log(`Lỗi đóng kết nối Redis: ${error.message}`);
    return {
      success: false,
      message: `Lỗi đóng kết nối Redis: ${error.message}`,
    };
  }
}

redisCluster.on("error", (err) => {
  console.error("Redis Cluster Error:", err);
});

module.exports = {
  setRedisData,
  getRedisData,
  getAllUserSocketsKeys,
  deleteRedisData,
  closeRedisConnection,
};
