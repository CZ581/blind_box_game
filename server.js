const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  // 导入 CORS 中间件
const app = express();
const port = 3000;

// 更新为正确的券码文件存储路径
const cardsDir = path.join(__dirname, 'data', 'cards');  // 指定奖品券码文件存储路径为 ./data/cards
const entryDir = path.join(__dirname, 'data', 'entry');  // 指定进入券码文件存储路径为 ./data/entry

// 使用 CORS 中间件，允许所有域名访问（或指定前端的域名）
app.use(cors());

// API: 获取指定文件中的券码，并删除已使用的券码
app.get('/get-coupon/:prize', (req, res) => {
  const prize = req.params.prize;
  const filePath = path.join(cardsDir, `${prize}.txt`);

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: '奖品券码文件不存在' });
  }

  // 读取券码文件
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: '读取券码文件失败' });
    }

    // 获取券码并删除文件中的券码
    const coupons = data.split('\n').filter(line => line.trim() !== '');
    if (coupons.length === 0) {
      return res.status(404).json({ message: '没有可用的券码' });
    }

    const coupon = coupons[0]; // 获取第一个券码
    const remainingCoupons = coupons.slice(1).join('\n'); // 剩余券码

    // 更新文件，删除已使用的券码
    fs.writeFile(filePath, remainingCoupons, 'utf-8', (err) => {
      if (err) {
        return res.status(500).json({ message: '更新券码文件失败' });
      }

      // 返回已获取的券码
      res.json({ couponCode: coupon });
    });
  });
});

app.get('/validate-coupon/:couponCode', (req, res) => {
  const couponCode = req.params.couponCode;
  console.log(`收到券码验证请求: ${couponCode}`);

  const couponFiles = [
    'entry_gy_1.txt',
    'entry_gy_3.txt',
    'entry_sk_1.txt',
    'entry_sk_3.txt'
  ];

  // 逐个读取每个券码文件并检查券码是否存在
  const checkCouponInFile = (fileName) => {
    return new Promise((resolve, reject) => {
      const filePath = path.join(entryDir, fileName); // 确保在这里定义了 filePath
      console.log(`检查文件: ${filePath}`);  // 添加日志输出

      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        console.error(`文件不存在: ${fileName}`);  // 打印错误
        return reject(`文件不存在: ${fileName}`);
      }

      // 读取文件内容
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
          console.error(`读取文件失败: ${fileName}`, err);  // 打印错误
          return reject(`读取文件失败: ${fileName}`);
        }

        // 检查券码是否存在
        const coupons = data.split('\n').map(line => line.trim());
        if (coupons.includes(couponCode)) {
          console.log(`券码 ${couponCode} 在文件 ${fileName} 中找到`);  // 打印日志
          
          // 删除已验证的券码
          const updatedCoupons = coupons.filter(coupon => coupon !== couponCode).join('\n');
          fs.writeFile(filePath, updatedCoupons, 'utf-8', (err) => {
            if (err) {
              console.error(`更新文件失败: ${fileName}`, err);
              return reject(`更新文件失败: ${fileName}`);
            }
            console.log(`券码 ${couponCode} 已删除`);
            resolve(fileName);  // 返回找到券码的文件名
          });
        } else {
          console.log(`券码 ${couponCode} 不在文件 ${fileName} 中`);  // 打印日志
          reject(null);  // 表示没有找到该券码
        }
      });
    });
  };

  // 异步遍历每个券码文件，找到匹配的券码文件
  Promise.allSettled(couponFiles.map(checkCouponInFile))
    .then(results => {
      const validFile = results.find(result => result.status === 'fulfilled' && result.value !== null);
      if (validFile) {
        console.log(`验证通过，券码 ${couponCode} 对应文件 ${validFile.value}`);  // 添加日志输出
        res.json({ message: '券码有效', file: validFile.value });
      } else {
        console.log(`验证失败，券码 ${couponCode} 无效`);  // 添加日志输出
        res.status(404).json({ message: '无效的券码' });
      }
    })
    .catch(err => {
      console.error('验证券码时发生错误:', err);  // 打印详细错误
      res.status(500).json({ message: '读取券码文件时发生错误', error: err });
    });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
