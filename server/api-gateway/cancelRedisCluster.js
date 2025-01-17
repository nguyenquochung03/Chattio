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

const cancelRedisCluster = () => {
  const nodes = ["8000", "8001", "8002", "8003", "8004", "8005"];

  nodes.forEach((node) => {
    checkConnect(node)
      .then(() => {
        // Nếu node đang chạy, tiến hành tắt
        exec(`redis-cli -p ${node} shutdown`, (err, stdout, stderr) => {
          if (err) {
            console.error(`Lỗi khi tắt Redis node ${node}: ${err.message}`);
            return;
          }
          console.log(`Đã tắt Redis node ${node} thành công.`);
        });
      })
      .catch((error) => {
        // Node không chạy, không cần tắt
        console.log(error);
      })
      .finally(() => {
        // Xóa file nodes.conf dù node đang chạy hay không
        const nodeDir = path.join(__dirname, node);
        const nodesConfPath = path.join(nodeDir, "nodes.conf");
        if (fs.existsSync(nodesConfPath)) {
          fs.unlink(nodesConfPath, (err) => {
            if (err) {
              console.error(
                `Lỗi khi xóa nodes.conf của node ${node}: ${err.message}`
              );
              return;
            }
            console.log(`Đã xóa file nodes.conf của node ${node}`);
          });
        }
      });
  });
};

cancelRedisCluster();

module.exports = { cancelRedisCluster };
