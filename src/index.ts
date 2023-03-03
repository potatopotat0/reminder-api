import express from 'express';
import bunyan from 'bunyan'
import crypto from 'crypto'
import upath from 'upath';
import fs from 'fs';
const app = express();
const logger = bunyan.createLogger({
    name: "reminder-api",
    level: bunyan.INFO,
    stream: process.stdout
});
const imgFolder = '../img_assets/';
const imgName = fs.readdirSync(upath.join(__dirname, imgFolder));
var suffleImg: string[];
var currentSuffleProgress = 0;
function fetchCurrentImageFilename() {
    if (currentSuffleProgress >= imgName.length) currentSuffleProgress = 0;
    if (currentSuffleProgress == 0) {
        suffleImg = imgName
            .map(val => ({ val, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ val }) => val);
    }
    return suffleImg[currentSuffleProgress++];
}
function getRandomElementFromArray(arr: any[]): any {
    return arr[crypto.randomInt(arr.length)];
}


logger.info("Loaded image list:");
logger.info(imgName);

app.get("/hourly", (req, res) => {
    res.type("text/plain; charset=utf-8");
    res.end(fetchCurrentImageFilename());
})

app.get("/random", (req, res) => {
    res.type("text/plain; charset=utf-8");
    res.end(getRandomElementFromArray(imgName));
})

app.get("/image", (req, res) => {
    if (typeof req.query.img == "string" && imgName.includes(req.query.img)) {
        res.sendFile(upath.join(__dirname, imgFolder, req.query.img));
    } else {
        res.status(404);
        res.end();
    }
})

let port = 9999;
if (process.env.PORT && !isNaN(parseInt(process.env.PORT))) {
    port = parseInt(process.env.PORT);
}

app.listen(port);
logger.info(`Server starts listening on ${port}`);