//console.log('Loaded!');

//var img = document.getElementById('madi');

//var marginLeft = 0;

/* function moveRight() {
  marginLeft = marginLeft+5;
  img.style.marginLeft = marginLeft +'px';
}

img.onclick= function () {
    var interval = setInterval(moveRight,50);
};
*/
/*
var button = document.getElementById('counter');
var counter;

button.onclick= function() {
    
    //Create a new HTTP request 
    var request = new XMLHttpRequest();
    
    // On state change, browser will know. Detect state change.
    
    request.onreadystatechange = function(){
      if (request.readyState === XMLHttpRequest.DONE)  {
         
         // Check if success
        if (request.status === 200){
            
            // Capture the respone and store it in a variable
              counter = request.responseText;
              var span = document.getElementById('count');
              span.innerHTML = counter.toString();
          }
      }
    };
    */
    /*
   counter = counter + 1;
   var span = document.getElementById('count');
   span.innerHTML = counter.toString();
   */
   
   /* Make a request to the counter endpoint(URL)
  // request.open('GET','http://anjanasen96.imad.hasura-app.io/counter',true);
  // request.send(null);
};  */

//Submit Login credentials

/*

var submit =  document.getElementById('submit_butn');

var names = [];
submit.onclick = function() {
    //Create a new HTTP request 
    var request = new XMLHttpRequest();
    
    // On state change, browser will know. Detect state change.
    request.onreadystatechange = function(){
      if (request.readyState === XMLHttpRequest.DONE)  {
         
         // Check if success
        if (request.status === 200){
           alert('Log in is successful');
        }
        else if (request.status === 403){
            alert('Username/password is incorrect');
        }
        else if (request.status === 500){
            alert('Something went worng in the server');
        }
      }
    };
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    
    // Make a request to the login endpoint(URL)
   
   request.open('POST','http://anjanasen96.imad.hasura-app.io/login',true);
   request.setRequestHeader('Content-Type','application/json');
   request.send(JSON.stringify({username: username, password: password}));
    
};

*/


function loadLogInForm(){
    var loginHtml = `
        <h3>Login/Register to unlock awesome features</h3>
        <input type="text" id="username" placeholder="username" />
        <input type="password" id="password" />
        <br/><br/>
        <input type="submit" id="login_btn" value="Login" />
        <input type="submit" id="register_btn" value="Register" />
        `;
    document.getElementById('login_area').innerHTML = loginHtml;
    
    // Submit username/password to login
    var submit = document.getElementById('login_btn');
    
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        var username = document.getElementById('username').value;
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.value = 'Sucess!';
                  loadLoggedInUser(username);
              } else if (request.status === 403) {
                  submit.value = 'Invalid credentials. Try again?';
              } else if (request.status === 500) {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              } else {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              }
              loadLogin();
              
          }  
          // Not done yet
        };
    
    // Make the request
        //var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        submit.value = 'Logging in...';
        
};


    var register = document.getElementById('register_btn');
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('User created successfully');
                  register.value = 'Registered!';
              } else {
                  alert('Could not register the user');
                  register.value = 'Register';
              }
          }
        };
        
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        register.value = 'Registering...';
    
    };
}


function loadLoggedInUser(username){
    var logInArea = document.getElementById('login_area');
    var welcomeinHtml = 
    `
        <h3> Hi! <i>${username}</i></h3>
        <a href="/logout">Logout</a>
    `
    ;
    
    logInArea.innerHtml = welcomeinHtml;
}



function loadLogin() {
    // Check if the user is already logged in
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState === XMLHttpRequest.DONE)  {
            if (request.status === 200 || request.status === 304) {
               loadLoggedInUser(this.responeText);
            }
            
            else {
                loadLogInForm();
            }
        }
    
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
    }


function loadArticles () {
        // Check if the user is already logged in
        
    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function () {
        
        if (request.readyState === XMLHttpRequest.DONE) {
            
            var articles = document.getElementById('articles');
            
            if (request.status === 200) {
                var content = '<ul>';
                var articleData = JSON.parse(this.responseText);
                
                for (var i=0; i< articleData.length; i++) {
                    content += `<li>
                    <a href="/articles/${articleData[i].title}">${articleData[i].heading}</a>
                    (${articleData[i].date.split('T')[0]})</li>`;
                }
                content += "</ul>";
                articles.innerHTML = content;
            } else {
                articles.innerHTML('Oops! Could not load all articles!');
            }
        }
    };
    
    request.open('GET', '/get-articles', true);
    request.send(null);
}

loadLogin();
loadArticles();