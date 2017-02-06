var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles = {
    'article-one':{
        title:'Article One',
        heading:'Welcome to Article One',
        date:'First created on Jan3 2017',
        content:`
        <p>
                         This is a simple article following the practical on how to write html documents. Nothing great but a beginning.
                     </p>
                      <p>
                         This is a simple article following the practical on how to write html documents. Nothing great but a beginning.
                     </p>
                      <p>
                         This is a simple article following the practical on how to write html documents. Nothing great but a beginning.
                     </p>'
    `
    },
    'article-two':{
        title:'Article Two',
        heading:'Welcome to Article Two',
        date:'Created on Jan5 2017',
        content:`
        <p>
           This is in continuation with article one              
        </p>'
    `
    },
    'article-three': {
        title:'Article Three',
        heading:'Welcome to Article Three',
        date:'It is created on Jan6 2017',
        content:`
        <p>
           This is the last one. So article three will be served right here.
        </p>'
    `
    }
};

function createTemplate (data)
{
    var title=data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    var htmlTemplate=
        ` <html>
          <head>
              <title>
                  ${title}
            </title>
    
            <link href="/ui/style.css" rel="stylesheet" />
        
          </head>
          <body>
              <div  class="container">
                  <div>
                      <a href="/">Home</a>
                 </div>
                 <hr/>
                 <h3>
                     ${heading} 
                 </h3>
                 <div>
                     ${date}
                 </div>
                 <div>
                     ${content}
                 </div> 
             </div>
          </body>
      </html>
    `
    ;
    return htmlTemplate;
}

var counter = 0;
app.get('/counter', function (req, res) {
    counter = counter +1;
  res.send(counter.toString());
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/:articleName', function (req, res) {
    //articleName = article-one
    //articles[articleName] == {} content object for article-one
    var articleName=req.params.articleName;
  res.send(createTemplate(articles[articleName]));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
