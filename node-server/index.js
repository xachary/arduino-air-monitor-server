const http = require("http");
const fs = require("fs");
const path = require("path");

process.env.TZ = "Asia/Shanghai";

function writeLog(type, num) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();

  const logName = `${year}${month.toString().padStart(2, "0")}${date
    .toString()
    .padStart(2, "0")}.txt`;

  const dirPath = path.resolve(__dirname, "data", type);

  const logPath = path.resolve(dirPath, logName);
  console.log("logPath", logPath);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
  fs.appendFileSync(
    logPath,
    `${hour.toString().padStart(2, "0")}${minute
      .toString()
      .padStart(2, "0")}${second.toString().padStart(2, "0")}_${num}\n`
  );
}

const server = http.createServer(function (request, response) {
  const url = request.url;
  const method = request.method.toLowerCase();
  console.log("url", url);
  console.log("method", method);

  if (method === "get") {
    if (url === "/") {
      // 首页
      fs.readFile(
        path.resolve(__dirname, "./web-site/index.html"),
        function (err, data) {
          if (!err) {
            response.writeHead(200, {
              "Content-Type": "text/html;charset=UTF-8",
              "cache-control": "no-cache",
            });
            response.end(data);
          } else {
            throw err;
          }
        }
      );
    } else if (/^\/.+\.(js|ico)$/.test(url)) {
      // 静态资源
      fs.readFile(
        path.resolve(__dirname, `./web-site${url}`),
        function (err, data) {
          if (!err) {
            response.writeHead(200, {
              "Content-Type": "application/javascript;charset=UTF-8",
            });
            response.end(data);
          } else {
            throw err;
          }
        }
      );
    } else {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();

      const logName = `${year}${month.toString().padStart(2, "0")}${date
        .toString()
        .padStart(2, "0")}.txt`;

      // 获取接口
      const type = url.match(/^\/([a-z\d]+)$/)?.[1];
      if (type) {
        console.log("type", type);

        const dirPath = path.resolve(__dirname, "data", type);

        const logPath = path.resolve(dirPath, logName);
        console.log("logPath", logPath);

        response.writeHead(200, {
          "Content-Type": "application/json;charset=UTF-8",
        });
        if (fs.existsSync(logPath)) {
          const content = fs.readFileSync(logPath).toString();
          const lines = content.split("\n");
          const records = [];
          for (const line of lines) {
            const data = line.match(/^(\d{6})_([\d.]+)$/);
            if (data) {
              const time = data[1];
              const value = parseFloat(data[2]);
              records.push({
                time,
                value,
              });
            }
          }
          response.end(JSON.stringify(records));
        } else {
          response.end(JSON.stringify([]));
        }
      }
    }
  } else if (method === "post") {
    if (/^\/batch$/.test(url)) {
      // 批量新增接口
      let body = "";

      request.on("data", (chunk) => {
        body += chunk;
      });

      request.on("end", () => {
        try {
          console.log("body", body);
          const data = JSON.parse(body);

          writeLog("hcho", data.hcho ?? 0);
          writeLog("tvoc", data.tvoc ?? 0);
          writeLog("co2", data.co2 ?? 0);
          writeLog("temp", data.temp ?? 0);
          writeLog("hum", data.hum ?? 0);
          writeLog("uv", data.uv ?? 0);

          response.writeHead(200, {
            "Content-Type": "application/json;charset=UTF-8",
          });
          response.end("{}");
        } catch (e) {
          console.error(e);
          response.writeHead(500, {
            "Content-Type": "application/json;charset=UTF-8",
          });
          response.end("{}");
        }
      });
    }
  } else {
    console.log("错误");
  }
});

server.listen(8081, "0.0.0.0");
