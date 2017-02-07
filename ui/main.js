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
    /*
   counter = counter + 1;
   var span = document.getElementById('count');
   span.innerHTML = counter.toString();
   */
   
   // Make a request to the counter endpoint(URL)
   request.open('GET','http://anjanasen96.imad.hasura-app.io/counter',true);
   request.send(null);
};

//Submit a name

var nameInput = document.getElementById('name');
var submit =  document.getElementById('submit_butn');

var names = [];
submit.onclick = function() {
    //Create a new HTTP request 
    var request = new XMLHttpRequest();
    
    var nameValue = nameInput.value;
    
    // Make a request to the counter endpoint(URL)
   request.open('GET','http://anjanasen96.imad.hasura-app.io/submit-name?name='+nameValue,true);
   request.send(null);
    
    // On state change, browser will know. Detect state change.
    
    request.onreadystatechange = function(){
      if (request.readyState === XMLHttpRequest.DONE)  {
         
         // Check if success
        if (request.status === 200){
            
            // Capture the respone and store it in a variable
              names = request.responseText;
              names = JSON.parse(names);
              var list = '';
            for (var i =0; i <names.length; i++){
                    list += '<li>' + names[i]+ '</li>';
                }
                var ul = document.getElementById('nameList');
                ul.innerHTML = list;
        }
      }
    };


};
