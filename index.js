const bodyParser = require('body-parser');
const express = require('express');
const qr_code = require('qrcode');
const path = require('path');
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the "images" directory
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
    res.render('index', { qr_code: '', img_src: '' });
});

app.post('/', (req, res) => {
    const url = req.body.url;
    // console.log(url);
    if (url) {
        qr_code.toDataURL(url, function (err, src) {
            if (err) {
                res.send(err);
                console.log(err);
                return;
            }
            const file_name = Date.now() + ".png";
            const file_path = path.join('images', file_name);
            qr_code.toFile(file_path, url, {
                color: {
                    dark: '#000',  // Black dots
                    light: '#0000' // Transparent background
                }
            }, function (err) {
                if (err) {
                    res.send(err);
                    console.log(err);
                    return;
                }
                res.render('index', { qr_code: src, img_src: file_path });
            });
        });
    } else {
        res.send('URL Not Set!');
    }
});

app.get('/download', (req, res) => {
    const file_path = req.query.file_path;
    res.download(file_path);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
