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
var counter = 0;

button.onclick= function() {
    var request = new XMLHttpRequest();
    
    request.onReadyStateChange = function(){
      if (request.readyState === XMLHttpRequest.DONE)  {
          if (request.status === 200){
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
   request.open('GET','http://anjanasen96.imad.hasura-app.io/counter',true);
   request.send(null);
};