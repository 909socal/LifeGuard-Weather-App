'use strict'

$(document).ready(init);
var weather;
var apiURL = 'http://api.wunderground.com/api/bca1d4903cff9d79/';
var zip;
var geoResponse;
var forcastResponse;
var weatherURL;
var forecastURL;

function init() {
	$('#wButton').on('click' , grabWeatherClick);
	$.get(apiURL + '/geolookup/q/autoip.json', geoWeather)
	$('#logme').hide();
    $('#regme').hide();
    $('ul').on("click","li",previousZip)
    getAllZips();
}

function previousZip () {
	$("#zip").val(Number($(this).text()));
	grabWeather(false);
}



var geoWeather = function(response){
	console.log('geoWeather: ' , response)
	geoResponse = response ;
	zip = response.location.zip;
	var city = response.location.city;
	var state = response.location.state;

	$('#myLocation').text( city + " , " +state +' Local Weather' )
	$.get(apiURL + 'forecast/q/' + zip + '.json' , weatherForcast);
}
 var weatherForcast = function(response){
	console.log('weatherForcast: ' , response)
	forcastResponse = response;
	weatherUpdate();
	weeksForcast();
}

function weatherUpdate(){
	$(".todays .icon").empty();
	console.log(areaData);
	var todaysForcast = forcastResponse.forecast.txt_forecast.forecastday[0];
	var todaysText = todaysForcast.fcttext;
	var todaysIcon = $('<img/>', {src: todaysForcast.icon_url});
	$('.2daysforcast .icon').empty();
	$('.2daysforcast .icon').append(todaysIcon);
	$('.weather').text(todaysText);
}


function grabWeather(boolean){
	zip = $("#zip").val();
	forecastURL = apiURL + 'forecast/q/' + zip+ '.json';
	weatherURL= apiURL+ '/geolookup/q/' + zip+ '.json'
	$.get(weatherURL, localData);
	if(boolean){
		$.ajax({
		  url: "users/zip",
		  type: 'PUT',
		  data: {zip: zip}
		}).done(function() {
			getAllZips();
		});
    }
}

function grabWeatherClick () {
	grabWeather(true);
}

function getAllZips() {
	$.get("users/allZips").done(function(zips) {
		$("#toAppendTo").empty();
		var $LIs = zips.map(function(zip){
			return $("<li>").text(zip);
		});
		$("#toAppendTo").append($LIs.reverse());
	})
	.fail(function() {
		alert( "error" );
	})
}

function localData(response){
	geoResponse = response;
	$.get(forecastURL, areaData)
	
}

function areaData (response){
	forcastResponse = response;
	weatherUpdate();
	weeksForcast();
}

function weeksForcast(){
	for(var i = 1; i <= 4; i++){
		var fori = i.toString();
		var asapWeather = forcastResponse.forecast.txt_forecast.forecastday[i];
		var getIcon = asapWeather.icon_url;
		var img = $('<img/>', { src: getIcon });

		var city = geoResponse.location.city;
		var state = geoResponse.location.state;

		$('#myLocation').text(city + " , " +state +' Local Weather');
		$('.day' + fori + ' .icon').empty();
		var dhaText = asapWeather.fcttext;
		var dhaTitle = asapWeather.title;
		$('#day' + fori).text(dhaTitle);
		$('.day' + fori +' .icon').empty();
		$('.day' + fori +' .icon').append(img);
		$('#weather' + fori).empty();
		$('#weather' + fori).append(dhaText);
		$('.hide').show();
	}
}





	
