const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const api = require('growtopia-api');
const gt = require("api-growtopia");
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

        gt.dailyQuest().then(data => {
            const item1_name = data.item1.name;
            const item1_amount = data.item1.amount;
            const item1_rate = data.item1.rate;
            const item1_price = data.item1.price;

            const item2_name = data.item2.name;
            const item2_amount = data.item2.amount;
            const item2_rate = data.item2.rate;
            const item2_price = data.item2.price;

            res.render('index', { playerCountFormatted, wotdName, wotdURL, item1_name, item1_amount, item1_rate, item2_name, item2_amount, item2_rate, item1_price, item2_price });
        })
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