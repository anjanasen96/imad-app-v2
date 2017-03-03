var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
var Pool = require('pg').Pool;// Create connection pool. DB used is postgress
var config = {          // Configuration for connection to DB
    user: 'anjanasen96',
    database: 'anjanasen96',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

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

//Connection pool is created globally so that it remains as long as app is alive
var pool = new Pool(config);

app.get('/test-db', function (req,res) {
    // Make a select request to DB
    pool.query('SELECT * FROM test',function(err,result){
        if (err) {                              // return response with the result/error
            res.status(500).send(err,toString());
        }
        else{
            res.send(JSON.stringify(result.rows));
        }
        
    });
    
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var listOfName = [];
app.get('/submit-name', function (req,res) {
   // Get name from request - xxxx/name
   // var name = req.params.name;This is to extract from input in the form  xxx/name
   
   // Another way of giving inout is with query paramter- //URL:submit-name?name=xxx
   
  // This is when to extract from query parameter in input
    var name = req.query.name; 
   listOfName.push(name);
   
   //JSON: Java Script Object Notation is used to convert object to string for sending back in response
   res.send(JSON.stringify(listOfName));
    
});

app.get('/articles/:articleName', function (req, res) {
    //articleName = article-one
    //articles[articleName] == {} content object for article-one
    // Without the single quote, to 
    pool.query("SELECT * FROM article where title = '" + req.params.articleName,`'`, function(err,result){
       if (err) {
           res.status(500).send(err,toString());
       }
           else {
               if (result.length === 0) {
                   res.status(404).send('Article not found');
               }
               else {
                   var articleData=result.rows[0];
                    res.send(createTemplate(articleData));
               }
           }
    });
    
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
