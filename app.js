const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const {
  createWorker
} = require('tesseract.js');
const worker = createWorker({
  logger: m => console.log(m)
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage
}).single('avatar');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index.ejs')
})
app.post('/upload', (req, res) => {
  upload(req, res, err => {
    fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
      if (err) return console.log('this is your error', err);
      (async () => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const {
          data: {
            text
          }
        } = await worker.recognize('https://www.bibleverseimages.com/love-bible-verse-2l.jpg');
        console.log(text);
        await worker.terminate();
      })();

    })
  })
  res.redirect('back')
})

app.listen(5000 || process.env.PORT, () => console.log('Running on port 5000'))