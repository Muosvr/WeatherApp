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
var tempToggle = false;
var temperatureDisplay="";
var temperatureC;
var temperatureF;
var loading = true;

//Load function when documnet is ready
$(window).on("load",function(){
    /* Notes: how to get Location
    e.g. To get location latitude and longitude
    navigator.geolocation.getCurrentPosition(function(position) {
    do_something(position.coords.latitude, position.coords.longitude);
    });
    */
    
  navigator.geolocation.getCurrentPosition (function(position){
      lat = position.coords.latitude;
      lon = position.coords.longitude;
    //   console.log("latitude: ", lat, "longitude: ", lon);
      
      //call to get weather data
      setTimeout(function(){
          makeRequest(lat,lon);
      },2000);
      
      
  });
    
    
    //create a new request
    
    function makeRequest(lat,lon){
        
        clearInterval(interval);
        
        var url = "https://fcc-weather-api.glitch.me/api/current?lat="+lat+"&lon="+lon;
        // console.log(url);
        const myRequest = new Request(url);
        
        //Andother way to make API request: $.getJSON(url,function(response){});
    
        // Getting a response
        weatherData = fetch(myRequest)
        .then(function(response){return response.json()})
        .then(function(data){
            weatherData = data;
            
            //Display location
            var location = weatherData.name;
            $("#location").text(location);
            // console.log(location);
            
            //Display weather description
            var description = weatherData.weather[0].description;
            $('#description').text(description);
            // console.log(description);
            
            //Load image
            var url = weatherData.weather[0].icon;
            var image = "<img src="+url+">";
            $("#icon").html(image);
            $("#icon img").addClass("icon");
            // console.log(url);
            
            //Load temperature
            temperatureC = weatherData.main.temp;
            temperatureF = temperatureC*9/5+32;
            
            //round to 1 demimal place
            temperatureF = precisionRound(temperatureF,1);
            temperatureC = precisionRound(temperatureC,1);
            
            //default to Fahrenheit
            temperatureDisplay = temperatureF+" F";
            $("#temperature").text(temperatureDisplay);
            
            //Display results
            $("#main").fadeIn(1000);
            
            $(".loader").addClass("disappear");
        },function(reason){
            console.error('onRejection function called: ', reason);
        });
    }
    
    $("#temperature").click(function(){
        if (tempToggle == false){
            temperatureDisplay = temperatureC + " C";
            $("#temperature").text(temperatureDisplay);
            tempToggle = true;
        }else{
            temperatureDisplay = temperatureF + " F"
            $("#temperature").text(temperatureDisplay);
            tempToggle = false;
        }
        
    //   console.log("toggle temp"); 
    });
    
    //founction for rounding
    function precisionRound(number, precision) {
      var factor = Math.pow(10, precision);
      return Math.round(number * factor) / factor;
    }
    
    //refresh button
    $("#refresh").click(function(){
        makeRequest(lat,lon);
        console.log("clicked");
    });
    
    //show change temperature unit when however
    $("#temperature").hover(function(){
        $("#temperature").css({background:"black",color:"white",
                               border:"2px solid black"})
                         .text("C/F");
    },function(){
        $("#temperature").css({background:"transparent",color:"black",
                               border:"2px solid black"})
                         .text(temperatureDisplay);
    })
    
    //main object fadeIn 
    $("#main").fadeIn(1000);
    
    function loader() {
        $(".loader").fadeIn(500);
        $(".loader").fadeOut(500);
    }

    var interval = setInterval(loader,1000);
      
    //   $("body").animate({"background-position":"40%"},2000,'linear');
});

