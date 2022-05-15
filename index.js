const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const api = require('growtopia-api');
const _cp = require('child_process');
const os = require('os');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    api.serverStatus().then(data => {
        const playerCount = data.playerCount;
        const playerCountFormatted = playerCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        const wotdName = data.wotdName;
        const wotdURL = data.wotdURL;

        res.render('index', { playerCountFormatted, wotdName, wotdURL });
    });
});

app.get('/play', (req, res) => {
    const growtopia = _cp.execFile(`${os.homedir()}/AppData/Local/Growtopia/Growtopia.exe`).on("spawn", () => {
        res.redirect('/');
    })

    growtopia.on("error", (err) => {
        res.json({ error: "Growtopia not found!" })
    })
})

app.listen(3000, console.log('Server started on port 3000'));