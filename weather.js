/**
 * Created by Jerry on 1/10/18.
 */
var api = "https://api.openweathermap.org/data/2.5/weather?"
var apiForecast = "http://api.openweathermap.org/data/2.5/forecast?";
var lat, lon;
var tempUnit = 'C';
var currentTempInCelsius;
var appId = "88b9b4352ae45deabd6584f0709b0521";

var weekday = [];
weekday[0] = "Sun";
weekday[1] = "Mon";
weekday[2] = "Tue";
weekday[3] = "Wed";
weekday[4] = "Thu";
weekday[5] = "Friday";
weekday[6] = "Sat";

var weatherIcon = [];
weatherIcon["drizzle"] = "wi-day-rain";
weatherIcon["thunderstom"] = "wi-day-lightning";
weatherIcon["clouds"] = "wi-day-cloudy";
weatherIcon["snow"] = "wi-day-light-wind";
weatherIcon["clear"] = "wi-day-sunny";
weatherIcon["rain"] = "wi-day-rain";

$( document ).ready(function(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = "lat=" + position.coords.latitude;
            var lon = "lon=" + position.coords.longitude;
            getWeather(lat, lon);
            getWeatherForecast(lat, lon, appId);
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
    $(".tempunit").click(function () {
        $(".tempunit").each(function( index ) {
            var currentTempUnit = $( this ).text();
            var newTempUnit = currentTempUnit == "C" ? "F" : "C";
            $( this ).text(newTempUnit);
            if (newTempUnit == "F") {

                var fahTemp = Math.round(parseInt($(this).prev().text()) * 9 / 5 + 32);

                $(this).prev().text(fahTemp + " " + String.fromCharCode(176));

            } else {
                var celTemp = Math.round((parseInt($(this).prev().text()) - 32) / 9 * 5);

                $(this).prev().text(celTemp + " " + String.fromCharCode(176));
            }
        });
    });


})

function getWeather(lat, lon) {
    var urlString = api + lat + "&" + lon + "&appId=" + appId;

    $.ajax({
        url: urlString, success: function (result) {
            $("#city").text(result.name + ", ");
            $("#country").text(result.sys.country);
            currentTempInCelsius = Math.round((result.main.temp - 273.15) * 10) / 10;
            $("#temp").text(currentTempInCelsius + " " + String.fromCharCode(176));
            $(".tempunit").text(tempUnit);
            $("#desc").text(result.weather[0].main);
            IconGen(result.weather[0].main);
            $('div.weather-content').removeClass('hide');
            $('div.loading').addClass('hide');
        }
    });

}

function getWeatherForecast(lat, lon, appId) {
    var urlString = apiForecast + lat + "&" + lon + "&cnt=40&appid=" + appId;
    console.log(urlString);
    var d = new Date();
    var n = d.getDay();

    var forecastTable = "";
    $.ajax({
        url: urlString, success: function (result) {

            var w_array = result.list;
            var i;
            for(i=0;i<40;i++){
                if ((i % 8) == 0){
                    w_forecast = w_array[i];
                    var t = Math.round((w_forecast.main.temp - 273.15) * 10) / 10;
                    t = t + " " + String.fromCharCode(176);
                    var cl = w_forecast.weather[0].main;

                    console.log(cl.toLowerCase());
                    cl = "<i class='forecast-icon wi "+ weatherIcon[cl.toLowerCase()]+ "'></i>";

                    console.log(cl);
                    var d = w_forecast.dt_txt;
                    forecastTable +="<tr><th scope='row'>"+weekday[(n%7)]+"</th><td>"+d+"</><td><span>"+t+"</span><span class='temp tempunit'>C</span></td> <td>"+cl+"</td> </tr>";
                    n += 1;
                }
            }
            $( 'tbody.forecast-table' ).append(forecastTable);
        }
    });
}

function IconGen(desc) {
    var desc = desc.toLowerCase()
    switch (desc) {
        case 'drizzle':
            addIcon(desc)
            break;
        case 'clouds':
            addIcon(desc)
            break;
        case 'rain':
            addIcon(desc)
            break;
        case 'snow':
            addIcon(desc)
            break;
        case 'clear':
            addIcon(desc)
            break;
        case 'thunderstom':
            addIcon(desc)
            break;
        default:
            $('div.clouds').removeClass('hide');
    }
}

function addIcon(desc) {
    $('div.' + desc).removeClass('hide');
}
