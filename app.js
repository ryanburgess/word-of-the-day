var express = require('express');
var app = express();
var cheerio = require('cheerio');
var request = require('request');
var wordOfDay = [];

app.get('/', function (req, res) {
  res.send('<a href="/api/">Word of the Day API</a>');
});

app.get('/api/', function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');

  request({
    method: 'GET',
    url: 'http://www.wordthink.com'
    }, function(err, response, body, callback) {
      if (err) return console.error(err);
      $ = cheerio.load(body);

      if(wordOfDay.length > 0){
        wordOfDay = [];
      }

      var post = $('#content .singlemeta:first-child .post');
      var word = post.find('.title').eq(0).text().replace('\r\n\t\t\t\t\t', '').replace('\r\n\t\t\t\t', '');
      var definition = post.find('p').eq(0).text().replace('\n', '');
      var month = post.find('.months').eq(0).text();
      var day = post.find('.dates').eq(0).text();
      var year = post.find('.years').eq(0).text();
      var date = month + ' ' + day + ', ' + year;

      wordOfDay.push({word: word, definition: definition, date: date})

  });
  res.send(JSON.stringify(wordOfDay, null, 4));
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('listening on port ' + port);
});
