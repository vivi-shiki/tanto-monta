/**
 * 脚本：更新 hex.json 的所有坐标
 * - 将 x 和 y 各增加 50
 * - 将坐标保留两位小数
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'hex.json');

// 读取文件
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 处理每个 hex
data.forEach(hex => {
	hex.x = Math.round((hex.x + 50) * 100) / 100;
	hex.y = Math.round((hex.y + 50) * 100) / 100;
});

// 写回文件，使用缩进 2 进行格式化
fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');

console.log(`✓ 已处理 ${data.length} 个 hex，坐标已更新并转换为两位小数`);
