(function (root) {
    root.templates = {
        weather: function anonymous(i, data, model) {
            var out = '<article class=\"item clearfix\"><h2>';
            out += (this.title);
            out += ' <span>as of ';
            out += (this.lastBuildDate);
            out += '</span></h2><div class=\"four columns alpha\"><h3>Current Conditions</h3><p class=\"condition\"><img src=\"http://l.yimg.com/a/i/us/we/52/';
            out += (this.item.condition.code);
            out += '.gif\">';
            out += (this.item.condition.temp);
            out += '&deg; ';
            out += (this.units.temperature);
            out += '</p><p>';
            out += (this.item.condition.text);
            out += '</p><p>Wind ';
            out += (this.wind.speed);
            out += (this.units.speed);
            out += ' ';
            out += (_.toDirection(this.wind.direction));
            out += '</p><p>Wind Chill ';
            out += (this.wind.chill);
            out += '&deg; ';
            out += (this.units.temperature);
            out += '</p></div><div class=\"six columns\"><h3>Forecast</h3>';
            out += (tpl(templates.forecast, this.item.forecast, this));
            out += '</div><div class=\"highchart six columns omega\"></div></article>';
            return out;
        },
        forecast: function anonymous(i, data, model) {
            var out = '<div class=\"day\"><p class=\"condition\"><img src=\"http://l.yimg.com/a/i/us/we/52/';
            out += (this.code);
            out += '.gif\">';
            out += (this.day);
            out += ', ';
            out += (this.date);
            out += '</p><p>';
            out += (this.text);
            out += '</p><p>High ';
            out += (this.high);
            out += '&deg; ';
            out += (model.units.temperature);
            out += '</p><p>Low ';
            out += (this.low);
            out += '&deg; ';
            out += (model.units.temperature);
            out += '</p></div>';
            return out;
        }
    }
})(this);