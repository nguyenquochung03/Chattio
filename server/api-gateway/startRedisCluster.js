const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

process.env.REDISCLI_AUTH = process.env.REDIS_PASSWORD;

const checkConnect = (port) => {
  return new Promise((resolve, reject) => {
    exec(`redis-cli -p ${port} PING`, (err, stdout, stderr) => {
      if (err) {
        reject(`Lỗi khi kết nối đến Redis node ${port}: ${err.message}`);
        return;
      }
      if (stderr) {
        reject(`stderr khi kiểm tra kết nối Redis node ${port}: ${stderr}`);
        return;
      }
      if (stdout.trim() === "PONG") {
        resolve();
      } else {
        reject(`Node ${port} chưa sẵn sàng.`);
      }
    });
  });
};

// Hàm khởi động Redis Cluster
function startRedisCluster() {
  const nodes = ["8000", "8001", "8002", "8003", "8004", "8005"];
  const promises = []; // Mảng chứa các Promise

  nodes.forEach((node) => {
    const nodeDir = path.join(__dirname, node);
    if (!fs.existsSync(path.join(nodeDir, "redis.conf"))) {
      reject(`Tệp redis.conf không tồn tại trong thư mục ${nodeDir}`);
      return;
    }
    console.log(`Đang khởi động Redis node ${node} tại thư mục: ${nodeDir}`);

    // Tạo Promise cho mỗi node
    const promise = new Promise((resolve, reject) => {
      exec(
        `cd ${nodeDir} && redis-server ./redis.conf`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(
              `Lỗi khi khởi động Redis node ${node}: ${err.message}`
            );
            reject(`Lỗi khởi động Redis node ${node}`);
            return;
          }
          if (stderr) {
            console.error(`stderr cho node ${node}: ${stderr}`);
            reject(`stderr cho node ${node}`);
            return;
          }
          console.log(`stdout cho node ${node}: ${stdout}`);
          console.log(`Redis node ${node} đã khởi động thành công.`);
          resolve();
        }
      );
    }).catch((error) => {
      console.error(error);
    });

    promises.push(promise);
  });

  // Sau khi tất cả các Redis node đã khởi động thành công, tạo cluster
  Promise.all(nodes.map((port) => checkConnect(port)))
    .then(() => {
      console.log("Tất cả Redis nodes đã sẵn sàng.");
      exec(
        `cmd /c "echo yes | redis-cli --cluster create 127.0.0.1:8000 127.0.0.1:8001 127.0.0.1:8002 127.0.0.1:8003 127.0.0.1:8004 127.0.0.1:8005 --cluster-replicas 1"`,
        { maxBuffer: 1024 * 1024 },
        (err, stdout, stderr) => {
          if (err) {
            console.error(`Lỗi khi tạo Redis cluster: ${err.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr khi tạo cluster: ${stderr}`);
            return;
          }
          console.log("Redis cluster đã được tạo thành công.");
        }
      );
    })
    .catch((error) => console.error(error));
}

startRedisCluster();

module.exports = { startRedisCluster };
