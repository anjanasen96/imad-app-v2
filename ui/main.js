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

var username = document.getElementById('username').value;
var password = document.getElementById('password').value;
console.log(username);
console.log(password);

var submit =  document.getElementById('submit_butn');

var names = [];
submit.onclick = function() {
    //Create a new HTTP request 
    var request = new XMLHttpRequest();
    
    
    // Make a request to the login endpoint(URL)
   
   request.open('POST','http://anjanasen96.imad.hasura-app.io/login',true);
   request.setRequestHeader('Content-Type','application/json');
   request.send(JSON.stringify({username: username, password: password}));
    
    // On state change, browser will know. Detect state change.
    
    request.onreadystatedchange = function(){
      if (request.readyState === XMLHttpRequest.DONE)  {
         
         // Check if success
        if (request.status === 200){
            
           console.log('User logged in');
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


};
