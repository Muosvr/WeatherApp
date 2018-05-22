 /* Notes and Questions
 
   How to create a GET Request method
   From https://developer.mozilla.org/en-US/docs/Web/API/Request
   
   Creat a new request
    //to Post
    const myRequest = new Request('http://localhost/api', {method: 'POST', body: '{"foo":"bar"}'});
    //to use GET: eliminate the second parameter after the comma in the above line)
    
    //What can you do with the constructed method
    const myURL = myRequest.url; // http://localhost/api
    const myMethod = myRequest.method; // POST
    const myCred = myRequest.credentials; // omit
    const bodyUsed = myRequest.bodyUsed; // true
    
   Fetch the API
        fetch(myRequest)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Something went wrong on api server!');
        }
      })
      .then(response => {
        console.debug(response);
        // ...
      }).catch(error => {
        console.error(error);
      });
      
    The .then() method
    From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
      
    Promise. What is it?
        From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
    
    
    Getting to the json: Sample code that works
    fetch(myRequest)
    .then(function(response){return response.json()})
    .then(function(data){console.log(data)});
        
    Question: Why do I need two .then to get to the actual json object?
    Question: Why variables inside .then don't get assgined when I access it from the outside? 
        A: Because .then is asychronous, and the value for variable might not have been passed 
        before it gets accessed if the variable is accessed from the outside. It's best to 
        access the variable inside .then method
    
    */
    
//initate variables
var weatherData = {};
var lat = NaN;
var lon = NaN;
var locationFound = false;

//Load function when documnet is ready
$(document).ready(function(){
    /* Notes: how to get Location
    e.g. To get location latitude and longitude
    navigator.geolocation.getCurrentPosition(function(position) {
    do_something(position.coords.latitude, position.coords.longitude);
    });
    */
    
  navigator.geolocation.getCurrentPosition (function(position){
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      console.log("latitude: ", lat, "longitude: ", lon);
      
      //call to get weather data
      makeRequest(lat,lon);
      
  });
    
    
    //create a new request
    // setInterval(makeRequest(),3000);
    
    function makeRequest(lat,lon){
        var url = "https://fcc-weather-api.glitch.me/api/current?lat="+lat+"&lon="+lon;
        console.log(url);
        const myRequest = new Request(url);
    
        //Getting a response
        weatherData = fetch(myRequest)
        .then(function(response){return response.json()})
        .then(function(data){
            weatherData = data;
            console.log(weatherData.coord);
        });
    }
    
    
      
});