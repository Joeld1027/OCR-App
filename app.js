const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const { createWorker } = require('tesseract.js');
const worker = createWorker({
  logger: m => console.log(m)
});

 const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, './uploads');
  },
  filename: (req, res, cb) =>{
    cb(null, req.file);
  }
 });

 const upload = multer({storage: storage}).single('avatar');

 app.set('view engine', 'ejs');

 app.get('/upload', (req, res)=>{

 })

 app.listen(5000 || process.env.PORT, () => console.log('Running on port 5000'))