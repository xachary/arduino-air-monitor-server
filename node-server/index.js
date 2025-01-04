const http = require("http");
const fs = require("fs");
const path = require("path");

process.env.TZ = 'Asia/Shanghai'

const server = http.createServer(function (request, response) {
  const url = request.url;
  const method = request.method.toLowerCase();
  const body = request.body;
  console.log("url", url);
  console.log("method", method);

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

  if (url === "/") {
    fs.readFile(
      path.resolve(__dirname, "./web-site/index.html"),
      function (err, data) {
        if (!err) {
          response.writeHead(200, {
            "Content-Type": "text/html;charset=UTF-8",
          });
          response.end(data);
        } else {
          throw err;
        }
      }
    );
  } else if (/^\/.+\.js$/.test(url)) {
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
    const type = url.match(/^\/([a-z\d]+)$/)?.[1];

    if (type) {
      console.log("type", type);

      const dirPath = path.resolve(__dirname, "data", type);

      const logPath = path.resolve(dirPath, logName);
      console.log("logPath", logPath);

      if (method === "get") {
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
      } else if (method === "post") {
        let body = "";

        request.on("data", (chunk) => {
          body += chunk;
        });

        request.on("end", () => {
          const num = parseFloat(body);
          console.log("body", body)

          if(!isNaN(num)){
            if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath);
            }
  
            fs.appendFileSync(
              logPath,
              `${hour.toString().padStart(2, "0")}${minute
                .toString()
                .padStart(2, "0")}${minute.toString().padStart(2, "0")}_${num}\n`
            );
          }

          response.writeHead(200, {
            "Content-Type": "application/json;charset=UTF-8",
          });
          response.end("{}");
        });
      }
    } else {
      console.log("错误");
    }
  }
});

server.listen(8081, "0.0.0.0");
