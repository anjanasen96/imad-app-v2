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

button.onclick= function() {
    var request = new XMLHttpRequest();
    
    request.onReadyStateChange = function(){
      if (request.readyState === XMLHttpRequest.DONE)  {
          if (request.Status === 200){
              var counter = request.responseText;
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