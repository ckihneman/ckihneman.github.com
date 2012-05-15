
# Resources

[Console](https://developer.yahoo.com/yql/console/#h=select%20*%20from%20weather.forecast%20where%20location%3D92101)

[Weather Icon](http://l.yimg.com/a/i/us/we/52/29.gif)

[Extending the weather API with YQL](http://developer.yahoo.com/blogs/ydn/posts/2009/12/extending_the_weather_api_with_yql/)

[Access Yahoo's Weather API via YQL and jQuery](http://graphicallyherdingthemasses.blogspot.com/2009/11/access-yahoos-weather-api-via-yql-and.html)

Two locations good, two errors - 99315


32.715329,-117.157255

32.7977,-117.1322

http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.placefinder%20where%20text%3D%2237.416275%2C%20-122.025092%22%20and%20gflags%3D%22R%22&appid=test


http://query.yahooapis.com/v1/public/yql?

q=select%20*%20from%20weather.forecast%20where%20location%20in%20(%0Aselect%20uzip%20from%20geo.placefinder%20where%20text%3D%22los%20angeles%22%20and%20gflags%3D%22R%22%0A)

&format=json

&callback=cbfunc