var cheerio = require('cheerio'),
	request = require('request');

var csgo99damage = {
	temp: {
		lastUpdate: 0,
		matches: {}
	}
}

function time() {
	return Math.round((new Date()).getTime() / 1000);
}
function timeByDate(date, hours) {
	var date=date.split(".");
	return new Date(date[1]+"/"+date[0]+"/"+date[2]+' ' + hours+':00').getTime() / 1000;
}

var http = require('http');

csgo99damage.getMatch = function(matchID, callback) {
	if ( this.temp.lastUpdate >= 1 && time() - this.temp.lastUpdate < 300 && this.temp.matches[matchID] && this.temp.matches[matchID].matchID ) {
		callback(null, this.temp.matches[matchID])
	} else {
		request({
			url: 'http://csgo.99damage.de/de/matches/'+matchID,
			headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0' }
		}, function(err, res, html) {
			if ( !err ) {
				var $ = cheerio.load(html);
				$('#content').each(function() {
					var winner = 0, status = 0,
						score = $(this).find('.score').text().trim(),
						date = $(this).find('.right').text().replace(' CEST', '').split(', '),
						team1logo = $($(this).find('.team_logo img')[0]).attr('src'),
						team2logo = $($(this).find('.team_logo img')[1]).attr('src'),
						streams = [];
					$('#content div').each(function(k) {
						if ( k == 42 ) {
							var as = $(this).find('a');
							for (var i=0;i<as.length;i++) {
								streams.push([$(as[i]).text(), $(as[i]).attr('href')]);
							}
						}
					});
					if ( score.indexOf('verschoben') >= 0 ) {
						winner = 3;
						status = 4;
					} else if ( score.indexOf('LIVE!') >= 0 ) {
						status = 1;
					} else {
						if ( score.indexOf('defwin')>=0 )
							status = 3
						else
							status = 2;
						var split = score.substr(0,5).split(':');
						split[0] = parseInt(split[0]);
						split[1] = parseInt(split[1]);
						if ( split[0] < split[1] )
							winner = 2;
						else if ( split[0] == split[1] )
							winner = 3;
						else
							winner = 1;
					}
					csgo99damage.temp.matches[matchID] = {
						team1: $($(this).find('.team')[0]).text().trim(),
						team2: $($(this).find('.team')[1]).text().trim(),
						team1logo:team1logo,
						team2logo:team2logo,
						matchID: matchID,
						winner: winner,
						status: status,
						streams: streams,
						start: timeByDate(date[0], date[1])
					}
					callback(null, csgo99damage.temp.matches[matchID]);
				});
			} else {
				callback(err);
			}
		});
	}	
};

csgo99damage.getMatches = function(callback) {
	if ( this.temp.lastUpdate >= 1 && time() - this.temp.lastUpdate < 300 ) {
		callback(null, this.temp.matches)
	} else {
		request({
			url: 'http://csgo.99damage.de/de/matches',
			headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0' }
		}, function(err, res, html) {
			if ( !err ) {
				csgo99damage.temp.matches		= {};
				csgo99damage.temp.lastUpdate	= time();
				var $ = cheerio.load(html);
				$('#content > .item').each(function() {
				
					var matchID = $($(this).find('a')[1]).attr('href').substr(35),
						span = $(this).find('span'),
						status = $(span[3]).text().trim().toLowerCase(),
						winner = 0,
						team1 = $(span[4]).text().trim(),
						team2 = $(span[2]).text().trim(),
						state = status,
						hour = '00:00';
					
					matchID = matchID.substr(0, matchID.indexOf('-'));

					if ( status == 'defwin' ) status = 3;
					else if ( status == 'live' ) status = 1;
					else if ( status == 'versch.' ) status = 4;
					else if ( status.indexOf('h') < 0 ) status = 2;
					else status = 0;
					
					if ( status == 0 ) {
						hour = state.substr(0,5);
					}
					if ( status == 2 && state.indexOf(':') >= 0 ) {
						var win = state.split(':');
						win[0] = parseInt(win[0]);
						win[1] = parseInt(win[1]);
						if ( win[0] == win[1] ) {
							winner = 3;
						} else if ( win[0] < win[1] ) {
							winner = 1;
						} else {
							winner = 2;
						}
					}

					if ( team1 != team2 ) csgo99damage.temp.matches[matchID] = {
						status: status,
						winner: winner,
						start: timeByDate($(span[1]).text().trim(), hour),
						team1: team1,
						team2: team2
					}
				});
				callback(null, csgo99damage.temp.matches);
			} else {
				callback(err);
			}
		});
	}
};

module.exports = csgo99damage;