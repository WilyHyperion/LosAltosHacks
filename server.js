
let app = require('express')();
let bodyParser = require('body-parser');
var fs = require('fs')
app.use(bodyParser.json())
let Scores = fs.readFileSync('scores.json');
Scores = JSON.parse(Scores);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    
});
app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/game.html');
});

app.get('/css/:filename', (req, res) => {
    res.sendFile(__dirname + '/css/' + req.params.filename);
});
app.get('/js/:filename', (req, res) => {
    res.sendFile(__dirname + '/js/' + req.params.filename);
});
app.get('/img/:filename', (req, res) => {
    res.sendFile(__dirname + '/Img/' + req.params.filename);
});
app.get('/enemy/:type/:filename', (req, res) => {
    res.sendFile(__dirname + '/enemy/' + req.params.type + '/'+ req.params.filename);
});
app.post('/highscore', (req, res) => {
    let b = ''
    for(let i = 0; i < 1; i++){
        b+= Scores[i].name + ' : ' + Scores[i].score;
    }
    res.send(b);
});
app.post('/addscore', (req, res) => {
    let b = req.body;
    Scores.push(b);
    Scores.sort((a, b) => {
        return b.score - a.score;
    });
    fs.writeFileSync('scores.json', JSON.stringify(Scores));
});
app.get('/leaderboard', (req, res) => {
    let f = fs.readFileSync('leaderboard.html');
    let html = f.toString();
    let li = "<ol>"
    for (let i = 0; i < Scores.length; i++) {
        li += '<li>' + Scores[i].name + ':' + Scores[i].score + '</li>';
    }
    li += "</ol>"
    html = html.replace("{{scores}}", li);
    res.send(html);
  });

app.get('/submit', (req, res) => {
    res.sendFile(__dirname + '/score.html');
});

app.get('/powerup/:filename', (req, res) => {
    res.sendFile(__dirname + '/powerup/' + req.params.filename);
});



app.listen(3000);

