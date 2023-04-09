const { Console } = require('console');

let app = require('express')();

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
    console.log(req.params.type);
    res.sendFile(__dirname + '/enemy/' + req.params.type + '/'+ req.params.filename);
});
app.get('/powerup/:filename', (req, res) => {
    res.sendFile(__dirname + '/powerup/' + req.params.filename);
});



app.listen(3000);

