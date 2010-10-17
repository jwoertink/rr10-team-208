var currentPlayer;

var Player = function(args) {
	this.attributes = {
		name: args["name"],
		points: args["points"],
		position: args["position"]
	}
};
var Action = {
	displayFlash: function() {
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
						var player = new Player({name: $(e).val(), points: 140, position: (i + 1)});
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
	},
	randomizePlayers: function() {
		function randomSort() {
			return Math.floor(Math.random() * Game.players.length + 1);
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
									  <img src="/images/default_avatar.png" /> \
										<div class="points"> \
										  <strong>' + player.attributes['points'] + '</strong> \
										  <em>bird seeds</em> \
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
	addPlayer: function() {
		
	},
	log: function(msg) {
		if('console' in window) {
			window.console.log(msg);
		} else {
			alert(msg);
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
				centerSplashScreen(300, 0);
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
	setFirstPlayer: function() {
		currentPlayer = $('.player:first');
		$('.player').removeClass('curren');
		$(currentPlayer).addClass('current');
	},
	setNewPlayer: function() {
		var currentIndex = $('.player').toArray().indexOf(currentPlayer[0]);
		var playerCount = $('.player').length;
		if(currentIndex != -1) {
			if(currentIndex < (playerCount - 1)) {
				if((currentIndex + 1) > playerCount) {
					Game.setFirstPlayer();
				} else {
					currentPlayer = $('.player').eq(currentIndex + 1);
					$('.player').removeClass('current');
					$(currentPlayer).addClass('current');
				}
			} else {
				Game.setFirstPlayer();
			}
		} else {
			Game.setFirstPlayer();
		}

		return currentPlayer;
	},
	grabQuestion: function() {
		if(currentPlayer != null) {
			$.ajax({
				url: '/questions/new',
				dataType: 'json',
				type: 'GET',
				success: function(data) {
					Game.displayQuestion(data.question);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert('PORKCHOP SANDWICHES. GTFO: ' + errorThrown);
				}
			});
		} else {
			Game.endRound();
		}
	},
	displayQuestion: function(question) {
		$('.question').remove();
		$('.splash').remove();
		var q = $('<div class="question splash"></div>');
		q.append('<h2>Fix Me with a Category</h1>');
		q.append('<h1>' + question.content + '</h1>');
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
			Game.log('Inside timer');
			Game.nextTurn();
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
				var newPoints = parseInt($('.points', currentPlayer).text(), 10) - question.value;
				$('.points', currentPlayer).text(newPoints);
			} else {
				Flash['wrong'] = 'WRONG!! Drink up!';
				Action.displayFlash();
			}
			Game.log('Inside clicking');
			Game.nextTurn();

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
	nextTurn: function() {
		$('.splash').remove();
		$.ajax({
			url: '/psas/random',
			dataType: 'json',
			type: 'GET',
			success: function(data) {
				var psa = $('<div class="psa splash"></div>');
				$(psa).append('<h1>' + data.psa.text + '</h1><br />');
				$(psa).append('<a href="#" rel="ready" class="button">Bring on the next question!</a>');
				$('body').prepend(psa);
				centerSplashScreen(600, 0);
				$('a[rel=ready]').live('click', function() {
				  var playerStatus = Game.setNewPlayer();
					if(playerStatus != null) {
						Game.grabQuestion();
				 	} else {
				 		Game.endRound();
				 	}
				 		
					return false;
				});
			},
			error: function(a, b, error) {
				alert(error);
			}
		});
	},
	endRound: function() {
		//things to happen when a round is complete....
	}
};
