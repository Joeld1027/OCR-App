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
app.use(express.static(__dirname + '/public'));

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
        } = await worker.recognize(data);
        console.log(text);
        await worker.getPDF(text);
        fs.writeFileSync('tesseract-ocr-result.pdf', Buffer.from(text));

        console.log('Generate PDF: tesseract-ocr-result.pdf');
        const results = `${__dirname}/tesseract-ocr-result.pdf`
        res.download(
          results
        )

        await worker.terminate();
      })();

    })
  })
})

app.listen(5000 || process.env.PORT, () => console.log('Running on port 5000'))