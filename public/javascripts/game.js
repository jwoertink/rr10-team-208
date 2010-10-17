var currentPlayerContainer;
var currentPlayer;
//The number of times to try and grab a question if it fails.
var retries = 1;

var Player = function(args) {
	this.attributes = {
		name: args["name"],
		points: Game.defaultPointValue,
		position: args["position"],
		avatar: args['avatar'],
		status: "",
		score: 0
	}

  this.title = function() {
    var titles = [ "president", "vice_president", "twithole" ];
    if (this.attributes["position"] <= 2) {
      return titles[this.attributes["position"]];
    } else {
      return "citizen";
    }
  }
};

var Action = {
	displayFlash: function() {
		$('.answer').die();
		$('#flash').remove();
		if(Flash['correct'] != '') {
			var correctMsg = $('<div id="flash" class="correct"></div>');
			$(correctMsg).text(Flash['correct']);
			$('body').append(correctMsg);
		} else if(Flash['wrong'] != '') {
			var wrongMsg = $('<div id="flash" class="wrong"></div>');
			$(wrongMsg).text(Flash['wrong']);
			$('body').append(wrongMsg);
		} else if(Flash['notice'] != '') {
			var noticeMsg = $('<div id="flash" class="notice"></div>');
			$(noticeMsg).text(Flash['notice']);
			$('body').append(noticeMsg);
		} else {
			// what else is there?
		}
		$('#flash');
		$('#flash').show('fast', function() {
		 	Action.resetFlash();
			window.setTimeout(function() {
				$('#flash').fadeOut('fast');
			}, 2500);
		});
	},
	resetFlash: function() {
		for(key in Flash) {
			Flash[key] = '';
		}
	}
}
var Flash = {
	correct: "",
	wrong: "",
	notice: ""
}

var Game = {
	intervalTimers: [],
	timeoutTimers: [],
	players: [],
	nextTermOrder: [],
	terms: 0,
	state: "play",
	defaultPointValue: 30,
	find_player_by_name: function(name) {
		var player;
		if(Game.players.length == 0) {
			player = null;
		} else {
			for(var i = 0; i < Game.players.length; i++) {
				if(Game.players[i].attributes['name'] == name) {
					player = Game.players[i];
				}
			}
		}
		return player;
	},
	init: function() {
		$('#gameform').submit(function() {
			var playersCount =  Game.players.length;
			var players = [];
			$('.playername').each(function(i,e) {
				if($(e).val() != '') {
					if($.inArray($(e).val(), players) == -1) {
						players.push($(e).val());
						playersCount += 1;
					}
				}
			});
			if(playersCount >= 3) {
				$('.playername', this).each(function(i,e) {
					if($(e).val() != '') {
						var twitter_handle = $(e).val().match(/@\w+/);
						var avatar;
						if(twitter_handle != null) {
							twitter_handle = twitter_handle[0].replace('@', '');
							var twiturl = 'http://api.twitter.com/1/users/show.json?screen_name=' + twitter_handle + '&callback=?';
							$.getJSON(twiturl, function(data) {
								avatar = data['profile_image_url'].replace('_normal', '');
								Game.find_player_by_name('@'+twitter_handle).attributes['avatar'] = avatar;
							});
							
						} else {
							avatar = '/images/default_avatar.png';
						}
						var player = new Player({name: $(e).val(), position: (i + 1), avatar: avatar});
						Game.players.push(player);
					}
				});

				//Do stuff to the form
				Game.randomizePlayers();
			} else {
				Flash['notice'] = 'You must add more players. Be sure there are no duplicates';
				Action.displayFlash();
			}			

			return false;
		});
	},
	start: function() {
		Game.grabQuestion();
		$(window).bind('beforeunload', function(event) {
			return '';
		});
	},
	randomizePlayers: function() {
		function randomSort(a, b) {
			// return Math.floor(Math.random() * Game.players.length + 1000);
			// return (Math.round(Math.random())-0.5);
      // Get a random number between 0 and 10
      var temp = parseInt( Math.random()*10 );
      // Get 1 or 0, whether temp is odd or even
      var isOddOrEven = temp%2;
      // Get +1 or -1, whether temp greater or smaller than 5
      var isPosOrNeg = temp>5 ? 1 : -1;
      // Return -1, 0, or +1
      return( isOddOrEven*isPosOrNeg );
		}
		var playersOrder = Game.players.sort(randomSort);
		$('#players').fadeOut('slow', function() {
			$.ajax({
				url: '/setting_player_order',
				dataType: 'html',
				type: 'GET',
				success: function(data) {
					$('.splash').remove();
					$('body').prepend(data);
					centerSplashScreen(400, 0);
					$('#gameform').fadeOut('fast');
					window.setTimeout(function() {
						$('#players').children().remove();
						
						$(playersOrder).each(function(i,player) {
							$('#players').append(' \
								<li> \
									<div class="player"> \
									  <div class="twithole ' + player.attributes["position"] + '"></div> \
									  <img src="' + player.attributes['avatar'] + '"	 /> \
									  <div class="' + player.title() + '"></div> \
										<div class="points"> \
										  <strong>' + player.attributes['points'] + '</strong> \
										  <em>bird seed</em> \
										</div> \
									</div> \
									<p class="name">' + player.attributes['name'] + '</p> \
								</li>'
							);
						});
						
						$('#players').fadeIn('fast');
						$('.splash').remove();
						Game.firstSessionPrep();
					}, 3000);
				},
				error: function(a,b,c) {
					alert('OH NOES!! WTF?!? PORKCHOP SANDWICHES. GET THE #!$@ OUT OF HERE!');
				}
			});
		});
	},
	log: function(msg) {
		if('console' in window) {
			window.console.log(msg);
		}
	},
	firstSessionPrep: function() {
		Game.setFirstPlayer();
		$.ajax({
			url: '/waiting_on_players',
			dataType: 'html',
			type: 'GET',
			success: function(data) {
				$('.splash').remove();
				$('body').prepend(data);
				centerSplashScreen(450, 0);
				var timer;
				timer = window.setInterval(function() {
					var time = $('.splash').find('.counter').text();
					var newCount = parseInt(time, 10) - 1;
					$('.splash').find('.counter').text(newCount);
				}, 1000);
				window.setTimeout(function() {
					window.clearInterval(timer);
					$('.splash').remove();
					Game.start();
				}, 10000);
			},
			error: function(a,b,c) {
				alert('OH NOES!! WTF?!? PORKCHOP SANDWICHES. GET THE #!$@ OUT OF HERE!');
			}
		});
	},
	reseatPlayers: function() {
		var playersOrder = Game.nextTermOrder;
		Game.nextTermOrder = [];
		$('#players').fadeOut('slow', function() {
			$.ajax({
				url: '/setting_player_order',
				dataType: 'html',
				type: 'GET',
				success: function(data) {
					$('.splash').remove();
					$('body').prepend(data);
					centerSplashScreen(400, 0);
					$('#gameform').fadeOut('fast');
					window.setTimeout(function() {
						$('#players').children().remove();
						
						$(playersOrder).each(function(i,player) {
							$('#players').append(' \
								<li> \
									<div class="player"> \
									  <div class="twithole ' + player.title() + '"></div> \
									  <img src="' + player.attributes['avatar'] + '"	 /> \
									  <div class="' + player.title() + '"></div> \
										<div class="points"> \
										  <strong>' + player.attributes['points'] + '</strong> \
										  <em>bird seed</em> \
										</div> \
									</div> \
									<p class="name">' + player.attributes['name'] + ' - ' + player.attributes['score'] + '</p> \
								</li>'
							);
						});
						
						$('#players').fadeIn('fast');
						$('.splash').remove();
						Game.firstSessionPrep();
					}, 3000);
				},
				error: function(a,b,c) {
					alert('OH NOES!! WTF?!? PORKCHOP SANDWICHES. GET THE #!$@ OUT OF HERE!');
				}
			});
		});
	},
	setFirstPlayer: function() {
		currentPlayerContainer = $('.player').not('.completed').first();
		$('.player').removeClass('current');
		$(currentPlayerContainer).addClass('current');
		currentPlayer = Game.find_player_by_name($(currentPlayerContainer).siblings('.name').text());
	},
	setNewPlayer: function() {
		$('a[rel=ready]').die();
		var players = $('.player').toArray();
		var currentIndex = players.indexOf(currentPlayerContainer[0]);
		var lastPlayerIndex = (players.length - 1);
		var totalPlayers = players.length;
		var activePlayers = $('.player').not('.completed').length;
		if(activePlayers > 1) {
			if(currentIndex == lastPlayerIndex) {
					Game.setFirstPlayer();
			} else {
					var nextPlayerContainer = $(players.rotate(currentIndex)).not('.completed').first();
					var nextIndex = players.indexOf(nextPlayerContainer[0]);
					
					if(currentIndex == nextIndex) {
						currentPlayerContainer = $($(players.rotate(nextIndex)).not('.completed')[1]);
					} else {
						currentPlayerContainer = nextPlayerContainer;
					}
					
					$('.player').removeClass('current');
					$(currentPlayerContainer).addClass('current');
					currentPlayer = Game.find_player_by_name($(currentPlayerContainer).siblings('.name').text());
			}
		} else {
			Game.state = "stop";
			Game.endTerm();
		}
		return currentPlayerContainer;
	},
	grabQuestion: function() {
		if(currentPlayerContainer != null && Game.state != 'stop') {
			$.ajax({
				url: '/questions/new',
				dataType: 'json',
				type: 'GET',
				success: function(data) {
					Game.displayQuestion(data.question);
					retries = 1;
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					switch(retries) {
						case 1:
							alert('WHOA! The tw!tth*le bird fell asleep. Give him a minute to wake him up, and get your next quesiton');
						break;
						case 2:
							alert('OMG.... Where the #*%@! did he go? This might take a little longer.');
						break;
						default :
							alert('Just continue to chat aomngst yourselves for a bit while we get this sorted out');
					}
					
					retries += 1;
					setTimeout(function() {
						Game.grabQuestion();
					}, 10000);
				}
			});
		}
	},
	displayQuestion: function(question) {
		$('.question').remove();
		$('.splash').remove();

		var color;
		switch (question.category) {
		case "How Many?": color = "red how_many"; break;
		case "Hash Tags": color = "green hash_tags"; break;
		case "True or False": color = "blue true_false"; break;
		case "Location": color = "purple location"; break;
		case "Pictures": color = "orange pictures"; break;
    }

		var q = $('<div class="question splash ' + color + '"></div>');

		if (question.category == "True or False") {
      for (var handle in question.profile_image_urls) {
        q.append('<div class="avatar"><img src="' + question.profile_image_urls[handle] + '" class="profile_image" /><span><strong>@' + handle + '</strong></span></div>');
      }
    } else {
      q.append('<div class="avatar"><img src="' + question.profile_image_url + '" class="profile_image" /></div>');
    }

		q.append('<h2>' + question.heading + ' Worth -' + question.value + ' bird seed</h1>');
    content = question.content.replace(/(@\w+)/gi, "<span class=\"handle\">$1</span>");
    q.append('<h1>' + content + '</h1>');
		var t = "";
		t += '<ul class="answers">';
		$(question.answers).each(function(i,e) {
			t += '<li><a href="#" class="button answer" rel="' + i + '">' + e + '</a></li>';
		});
		t += '</ul>';
		q.append(t);
		q.append("<br class=\"clear\" />");
		q.append('<span class="counter">' + question.countdown + '</span>');
		$('body').prepend(q);
		centerSplashScreen(900, 0);
		var questionTime = parseInt($('.counter', q).text(), 10) * 1000;
		var intervalTimer;
		var timeoutTimer;
		intervalTimer = window.setInterval(function() {
			var time = $('.splash').find('.counter').text();
			var newCount = parseInt(time, 10) - 1;
			$('.splash').find('.counter').text(newCount);
		}, 1000);
		timeoutTimer = window.setTimeout(function() {
			window.clearInterval(intervalTimer);
			$('.splash').remove();
			Flash['wrong'] = 'WRONG!! Drink up!';
			Action.displayFlash();
			Game.nextTurn(question);
		}, questionTime);
		Game.intervalTimers.push(intervalTimer);
		Game.timeoutTimers.push(timeoutTimer);
		$('.answer').live('click', function() {
			Game.clearTimers();
			$('.splash').remove();
			var correctAnswer = question.selection;
			var selectedAnswer = $(this).attr('rel');
			
			if(selectedAnswer == correctAnswer) {
				Flash['correct'] = 'YAY! Well played';
				Action.displayFlash();
				var newPoints = parseInt($('.points', currentPlayerContainer).text(), 10) - question.value;
				$('.points strong', currentPlayerContainer).text(newPoints);
				currentPlayer.attributes['points'] = newPoints;
			} else {
				Flash['wrong'] = 'WRONG!! Drink up!';
				Action.displayFlash();
			}
			if(currentPlayer.attributes['points'] <= 0 && currentPlayer.attributes['status'] == '') {
				currentPlayer.attributes['status'] = 'completed';
				currentPlayer.attributes['points'] = 0;
				$('.points', currentPlayerContainer).text('<strong>Done!</strong>');
				$(currentPlayerContainer).addClass('completed');
				Game.nextTermOrder.push(currentPlayer);
				Game.players.splice(Game.players.indexOf(currentPlayer) ,1);
			}
			Game.nextTurn(question);
			
			return false;
		});

	},
	clearTimers: function() {
		$(Game.intervalTimers).each(function(i,timer) {
			window.clearInterval(timer);
		});
		$(Game.timeoutTimers).each(function(i, timer) {
			window.clearTimeout(timer);
		});
		Game.intervalTimers = [];
		Game.timeoutTimers = [];
	},
	nextTurn: function(previousQuestion) {
		if(Game.state == 'play') {
			$('.splash').remove();
			$.ajax({
				url: '/psas/random',
				dataType: 'json',
				data: { previousQuestion:previousQuestion },
				type: 'POST',
				success: function(data) {
					var psa = $('<div class="psa splash"></div>');
					$(psa).append('<h2>Last Question Was (' + data.psa.previous_question.category + ')</h2>');
					$(psa).append('<img src="' + data.psa.previous_question.profile_image_url + '" class="left" style="border: 4px solid white; width: 100px; height: 100px; margin: 0 10px 10px 0;" />');
					$(psa).append('<h2>' + data.psa.previous_question.content + '</h2>');
					$(psa).append('<br /><h1>Correct Answer Was: ' + data.psa.previous_question.answers[parseInt(data.psa.previous_question.selection)] + '</h1>');
					$(psa).append('<br /><fieldset><legend>TwitHole PSA</legend><p>' + data.psa.text + '</p></fieldset><br />');
					$(psa).append('<a href="#" rel="ready" class="button go">Bring on the next question!</a>');
					$('body').prepend(psa);
					centerSplashScreen(600, 0);
					$('a[rel=ready]').live('click', function() {
					  var playerStatus = Game.setNewPlayer();
						if(playerStatus != null) {
							Game.grabQuestion();
					 	}

						return false;
					});
				},
				error: function(a, b, error) {
					alert(error);
				}
			});
		}
	},
	endRound: function() {
		//things to happen when a round is complete....
		Game.log('Just completed a round');
	},
	endTerm: function() {
		$('.psa').remove();
		$('.spash').remove();
		Game.clearTimers();
		Game.terms += 1;
		Game.nextTermOrder = Game.nextTermOrder.concat(Game.players);
		
		$.ajax({
			url: '/end_of_term',
			dataType: 'html',
			type: 'get',
			success: function(data) {
				$('body').prepend(data);
				centerSplashScreen(650, 0);
				$('.splash h1 strong').text(ordinal(Game.terms));
				$(Game.nextTermOrder).each(function(i, player) {
					switch(i) {
						case 0 :
							player.attributes['score'] += 2
							player.attributes['position'] = 0
							break;
						case 1 :
							player.attributes['score'] += 1
							player.attributes['position'] = 1
							break;
						case (Game.nextTermOrder.length - 1) :
							// this should be the twithole...
							player.attributes['position'] = 2
							break;
						default :
							//don't know..
					}
					$('.splash #positions').append('<li>' + player.attributes['name'] + ' - '+player.attributes['score']+'</li>');
					$('#play_term').live('click', function() {
						Game.startTerm();
						return false;
					});
				});
				
			},
			error: function(a,b,error) {
				
			}
		});
		
	},
	startTerm: function() {
		Game.state = 'play';
		Game.players = [];
		$(Game.nextTermOrder).each(function(i,player) {
			player.attributes['points'] = Game.defaultPointValue;
		});
		Game.reseatPlayers();

	}
};
