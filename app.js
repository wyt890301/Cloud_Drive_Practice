var express = require('express')
var bodyParser = require('body-parser')
var mysql = require("mysql")
const multer = require('multer')
var jwt = require('jsonwebtoken')
var config = require('./config')

var app = express()
const fs = require('fs')
const { getMaxListeners } = require('process')
const UPLOAD_PATH = './uploads'
var upload = multer({
  dest: UPLOAD_PATH,
})

app.use(bodyParser.json())
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

// 關鍵字express multer上傳檔案
app.post('/upload', upload.single('fileUpload'), function (req, res, next) {
  console.log(req.file.path)
  fs.readFile(req.file.path, function (err, data) {
    var newFile = "./uploads/" + req.file.originalname;
    fs.writeFile(newFile, data, function (err) {
      if (err) {
        res.json({ err })
      } else {
        res.json({ msg: `上傳成功` })
        fs.unlink(req.file.path, function (err) { if (err) throw err})
      }
    })
  })
})

//讀取檔案目錄
app.get('/list', function (req, res) {
  var dataList = []
  fs.readdir('./uploads', function (err, files) {
    if (err) {
      return console.error(err)
    }
    for (var i = 0; i < files.length; i++) {
      console.log(files[i].toString())
      dataList.push(files[i].toString())
    }
    res.send(dataList)
  })
})

//下載檔案
app.get('/download/:filename', function (req, res, next) {
  var downloadFile = req.params.filename
  var path = './uploads/' + downloadFile
  res.download(path, downloadFile)
  res.send('成功下載' + downloadFile)
})

//刪除檔案
app.get('/delete/:filename', function (req, res) {
  var deleteFile = req.params.filename
  var path = './uploads/' + deleteFile
  fs.unlink(path, function (err) {
    if (err) throw err
    console.log('成功刪除' + deleteFile)
  })
})

//連接資料庫
var conn = mysql.createConnection({
  host: '172.17.0.2',
  port: '3306',
  user: 'root',
  password: '123456',
  database: 'test'
});
conn.connect(function(err){
  if(err) throw err;
  console.log("成功連接")
})

//登入
app.post('/login', function(req, res){
  let password = req.query.password
  let email = req.query.email
  console.log(password, email)
  //連接資料庫
  var sql = "SELECT * FROM User WHERE password = '" + password + "' AND email = '" + email + "';";
  conn.query(sql, function(err, results, fields){
    if(err) throw err
    console.log(results[0])
    if(results[0] == "")
      res.send("登入失敗")
    else
      console.log(results[0].id)
      //token設定 (payload一定要為json檔 and secret的內容在.config.js)
      var payload = {id: results[0].id, email: results[0].email}
      var token = jwt.sign( payload, config.secret, { expiresIn: '1d' });
      res.send(token)
  })
})
app.listen(3000)

