<script id="weather">
	<article class="item clearfix">
		<h2><*= this.title *> <span>as of <*= this.lastBuildDate *></span></h2>
		<div class="four columns alpha">
			<h3>Current Conditions</h3>
			<p class="condition"><img src="http://l.yimg.com/a/i/us/we/52/<*= this.item.condition.code *>.gif"><*= this.item.condition.temp *>&deg; <*= this.units.temperature *></p>
			<p><*= this.item.condition.text *></p>
			<p>Wind <*= this.wind.speed *><*= this.units.speed *> <*= _.toDirection( this.wind.direction ) *></p>
			<p>Wind Chill <*= this.wind.chill *>&deg; <*= this.units.temperature *></p>
		</div>
		<div class="six columns">
			<h3>Forecast</h3>
			<*= tpl( templates.forecast, this.item.forecast, this ) *>
		</div>
		<div class="highchart six columns omega"></div>
	</article>
</script>

<script id="forecast">
	<div class="day">
		<p class="condition">
			<img src="http://l.yimg.com/a/i/us/we/52/<*= this.code *>.gif">
			<*= this.day *>, <*= this.date *>
		</p>
		<p><*= this.text *></p>
		<p>High <*= this.high *>&deg; <*= model.units.temperature *></p>
		<p>Low <*= this.low *>&deg; <*= model.units.temperature *></p>
	</div>
</script>

