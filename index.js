// Require Express.js
const express = require('express');
const app = express();
const { argv } = require('process');
const db = require('./src/services/database.js')
const morgan = require('morgan')
const fs = require('fs')
const cors = require('cors')
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('./public'))

// Get Port
const args = require("minimist")(process.argv.slice(2));
var port = args.port || 5000;

// Start an app server
const server = app.listen(port, () => {
  console.log('App listening on port %PORT%'.replace('%PORT%',port));
});


args["debug"] || false
var debug = args.debug
args["log"] || true
var log = args.log
args["help"]

if (args.help === true) {
  console.log(`server.js [options]
  --port	Set the port number for the server to listen on. Must be an integer
              between 1 and 65535.

  --debug	If set to \`true\`, creates endlpoints /app/log/access/ which returns
              a JSON access log from the database and /app/error which throws 
              an error with the message "Error test successful." Defaults to 
              \`false\`.

  --log		If set to false, no log files are written. Defaults to true.
              Logs are always written to database.

  --help	Return this message and exit.`)
  process.exit(0)
}

// Logging to database
if (log === true) {
  // Use morgan for logging to files
  // Create a write stream to append (flags: 'a') to a file
  const accesslog = fs.createWriteStream('access.log', { flags: 'a' })
  // Set up the access logging middleware
  app.use(morgan('accesslog', { stream: accesslog }))
}

// Middleware function
app.use((req, res, next) => {
  let logdata = {
    remoteaddr: req.ip,
    remoteuser: req.user,
    time: Date.now(),
    method: req.method,
    url: req.url,
    protocol: req.protocol,
    httpversion: req.httpVersion,
    status: res.statusCode,
    referer: req.headers['referer'],
    useragent: req.headers['user-agent']
  }
  const stmt = db.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
  const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.status, logdata.referer, logdata.useragent)

  next();
});

if (debug === true) {
  // Access log endpoint
  app.get('/app/log/access', (req,res) => {
    const stmt = db.prepare('SELECT * FROM accesslog').all()
    res.status(200).json(stmt)
  })

  // Error endpoint
  app.get('/app/error', (req,res) => {
    throw new Error('Error test successful')
  })
}

app.get('/app/', (req, res, next) => {
  res.status(200).json({
      'message': "Your API works! (200)"
  })
});

// Endpoint definitions
app.get('/app/flip', (req,res) => {
  res.contentType('text/json');
  res.status(200).json({'flip' : coinFlip()});
});

app.get('/app/flip/coin', (req, res) => {
  res.contentType('text/json');
  res.status(200).json({'flip' : coinFlip()});
});

app.get('/app/flips/:number', (req, res) => {
  res.contentType('text/json');
  const flips = coinFlips(req.params.number);
  const count = countFlips(flips);
  res.status(200).json({'raw':flips,'summary' : count});
});

app.post('/app/flip/coins/', (req, res, next) => {
    const flips = coinFlips(req.body.number)
    const count = countFlips(flips)
    res.status(200).json({"raw":flips,"summary":count})
})

app.post('/app/flip/call/', (req, res, next) => {
    const game = flipACoin(req.body.guess)
    res.status(200).json(game)
})

app.get('/app/flip/call/:guess(heads|tails)/', (req, res, next) => {
    const game = flipACoin(req.params.guess)
    res.status(200).json(game)
})

// app.get('/app/flip/call/heads', (req,res) => {
//   res.contentType('text/json');
//   res.status(200).json(flipACoin('heads'));
// });

// app.get('/app/flip/call/tails', (req,res) => {
//   res.contentType('text/json');
//   res.status(200).json(flipACoin('tails'));
// });

app.use(function(req,res) {
  res.status(404).end('Endpoint does not exist');
  res.type('text/plain');
});

// Default response for any other request
app.use(function(req,res){
    res.status(404).send('404 NOT FOUND');
});


function coinFlip() {
  let flip = Math.floor(Math.random() * 2);
  if (flip < 1) {
    return "tails";
  }
  else if (flip >= 1) {
    return "heads";
  }
}

function coinFlips(flips) {
  var results = [flips];
  for (let i = 0; i < flips; i++) {
      results[i] = coinFlip();
  }
  return results;
}

function countFlips(array) {
  let heads_num = 0;
  let tails_num = 0;
  if(array.length > 1) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] == 'tails') {
        tails_num += 1;
      }
      else if (array[i] == 'heads') {
        heads_num += 1;
      }
    }
  }
  else if (array.length == 1) {
    if (array[0] == 'tails') tails_num += 1;
    else if (array[0] == 'heads') heads_num += 1;
  }
  if (heads_num == 0) return {tails: tails_num};
  else if (tails_num == 0) return {heads: heads_num};
  else return {heads: heads_num, tails: tails_num};
}

function flipACoin(call) {
  let toss = coinFlip();
  if (toss.toUpperCase() == call.toUpperCase()) return {call: call, flip: toss, result: "win"};
  else return {call: call, flip: toss, result: "lose"} ;
}