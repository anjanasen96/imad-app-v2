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
var nameValue = nameInput.value;
var submit =  document.getElementById('submit_butn');

submit.onclick = function() {


var names = ['name1','name2', 'name3','name4'];

var list = '';
for (var i =i; i <names.length; i++){
    list += '<li>' + names[i]+ '</li>';
}
var ul = document.getElementById('nameList');
ul.innerHTML = list;
};
