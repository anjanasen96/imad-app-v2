var express = require('express');
var morgan = require('morgan');
var path = require('path');
var app = express();
var Pool = require('pg').Pool;// Create connection pool. DB used is postgress
var crypto = require('crypto');
var bodyParser = require('body-parser');// express library
var session = require('express-session');

var config = {          // Configuration for connection to DB
    user: 'anjanasen96',
    database: 'anjanasen96',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};

app.use(morgan('combined'));
app.use(bodyParser.json()); // Tell express app that incase json content is encountered,load it in req.body variable
app.use(session({
    secret: 'someRandomValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
    
}));
    
 
/*
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
*/

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
                     ${date.toDateString()}
                 </div>
                 <div>
                     ${content}
                 </div> 
                 <hr/>
                    <h4>Comments</h4>
                <div id="comment_form">
                </div>
                <div id="comments">
                <center>Loading comments...</center>
              </div>
            </div>
            <script src="/ui/article.js"></script>
          </body>
      </html>
    `
    ;
    return htmlTemplate;
}

/*

var counter = 0;
app.get('/counter', function (req, res) {
    counter = counter +1;
  res.send(counter.toString());
});
*/
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

//Connection pool is created globally so that it remains as long as app is alive
var pool = new Pool(config);
/*
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
*/

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

/*pbkdf25Sync: password based key derivative function. This function is taking the 'input',
appending the salt(this-is-some-random-string) and hashing it 10000 times to create a hashed value
that is of 512 bytes. This is to ensure higher security. 'salt' is randomly generated.
*/

function hash(input,salt){
    //Creating a hash for the given input. Check nodejs documentation for more info on crypto.
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2sync","10000",salt,hashed.toString('hex')].join("$");
}
app.get('/hash/:input',function(req,res){
    var hashedString= hash(req.params.input,'this-is-some-random-string');
    res.send(hashedString);
});

//Username and passowrd will be sent as part of body and not url. 
app.post('/create-user',function(req,res){
    //extract username and passord from body of request.
    
    var username=req.body.username;
    var password=req.body.password;
    
    var salt=crypto.randomBytes(128).toString('hex');
    var dbString=hash(password,salt);
    pool.query('INSERT into "user" (username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
        if (err) {                              // return response with the result/error
            res.status(500).send(err,toString());
        }
        else {
            res.send('User successfully created: '+ username);
        }
    });
});

app.post('/login',function(req,res){
   
        var username=req.body.username;
        var password=req.body.password;
        
       pool.query('SELECT * from "user" WHERE username = $1',[username],function(err,result){
        if (err) {                              // return response with the result/error
            res.status(403).send(err.toString());
        }
        else {
            if (result.rows.length === 0){
             //res.send('User credentials incorrect'); 
             res.status(403).send('Username/password is invalid');
               
            }
            else{
                    //Match the password
                    var dbString = result.rows[0].password;
                    var salt = dbString.split('$')[2];
                    var hashedString = hash(password,salt);
                    if (dbString === hashedString){
                        
                        // Set the session
                        req.session.auth = {userId: result.rows[0].id};
                        // set cookie with a session id.
                        //Internally on the server side, it maps the cookie with an object
                        //{auth: {userId}}
                        res.send('Credentials correct');
                    }
                    else {
                        res.status(403).send('Incorrect username/password.');
                    }
        }
    }
});
});

app.get('/check-login',function(req,res){
    
/*    if (req.session && req.session.auth && req.session.auth.userId)

    {
        res.send("You are logged in: "+ req.session.auth.userId.toString());
    } else {
        res.send('You are not logged in.');
    }
*/

    if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

/*
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
*/

app.get('/logout',function(req,res){
    delete req.session.auth;
    //res.send('Logged Out.');
    res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});


app.get('/get-articles', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM article ORDER BY date DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});


app.get('/get-comments/:articleName', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query(
'SELECT comment.*, "user".username FROM article, comment, "user" WHERE article.title = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});


app.post('/submit-comment/:articleName', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from article where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!');
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});


app.get('/articles/:articleName', function (req, res) {
    //articleName = article-one
    //articles[articleName] == {} content object for article-one
    // Single quote to differentiate '-' in articleName from minus sign
    pool.query("SELECT * FROM article where title = '" + req.params.articleName +`'`, function(err,result){
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

app.get('/ui/article.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article.js'));
});



var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});