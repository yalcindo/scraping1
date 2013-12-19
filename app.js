
/**
 * Module dependencies.
 */
var csv = require('csv');
var fs = require('fs');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var request=require("request");
var cheerio=require("cheerio");
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
request("https://news.ycombinator.com",function(err,response,body)
{
  if (!err && response.statusCode == 200) {
    // console.log(body) 
    scrapper =cheerio.load(body);
    var cats=scrapper(".title").map(function(i,el){


        return scrapper(this).text();
    });

    var file=fs.createWriteStream("data2.csv");
    file.on('error', function(err) { 
    	console.log(err) 
    });
    cats.forEach(function(v) { 
   		file.write(v+'\n'); 

    });
   file.end();
   
    // fs.writeFile("./data.csv",cats,function(err)
    // {
    // 	 if (err) return console.log(err);
    // 	});

    
  }

});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
