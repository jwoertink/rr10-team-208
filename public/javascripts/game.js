var currentPlayer;

var Game = {
	intervalTimers: [],
	timeoutTimers: [],
	players: [],
	init: function() {
		$('#gameform').submit(function() {
			var playersCount =  Game.players.length;
			$('.playername').each(function(i,e) {
				if($(e).val() != '') {
					playersCount += 1;
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
				alert('You must add more players');
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
					$('#gameform').fadeOut('fast');
					setTimeout(function() {
						$('#players').children().remove();
						
						$(playersOrder).each(function(i,player) {
							$('#players').append(' \
								<li> \
									<div class="player"> \
										<!-- <span>Position: </span><span class="position">' + player.attributes["position"] + '</span><br /> --> \
										<span class="points">'+player.attributes['points']+'<span> bird seeds</span></span> \
									</div> \
									<h3 class="name">'+ player.attributes['name'] + '</h3> \
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
				var timer;
				timer = setInterval(function() {
					var time = $('.splash').find('.counter').text();
					var newCount = parseInt(time, 10) - 1;
					$('.splash').find('.counter').text(newCount);
				}, 1000);
				setTimeout(function() {
					clearInterval(timer);
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
	grabQuestion: function() {
		if(currentPlayer != null) {
			$.ajax({
				url: '/questions/new',
				dataType: 'json',
				type: 'GET',
				success: function(data) {
					var questions = data.questions
					var question = questions[Math.floor(Math.random() * questions.length)];
					Game.displayQuestion(question);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert('PORKCHOP SANDWICHES. GTFO: ' + errorThrown);
				}
			});
		} else {
			endRound();
		}
	},
	displayQuestion: function(question) {
		$('.question').remove();
		$('.splash').remove();
		var q = $('<div class="question splash"></div>');
		q.append('<h1>' + question.content + '</h1>');
		$(question.answers).each(function(i,e) {
			q.append('<a href="#" class="answer" rel="' + i + '">' + e + '</a>');
		});
		q.append('<span class="counter">' + question.countdown + '</span>');
		$('body').prepend(q);
		var questionTime = parseInt($('.counter', q).text(), 10) * 1000;
		var intervalTimer;
		var timeoutTimer;
		intervalTimer = setInterval(function() {
			var time = $('.splash').find('.counter').text();
			var newCount = parseInt(time, 10) - 1;
			$('.splash').find('.counter').text(newCount);
		}, 1000);
		timeoutTimer = setTimeout(function() {
			clearInterval(intervalTimer);
			$('.splash').remove();
			console.log('Something happens because your bitch ass just got the question wrong!');
			Game.nextTurn();
		}, questionTime);
		Game.intervalTimers.push(intervalTimer);
		Game.timeoutTimers.push(timeoutTimer);
		$('.answer').live('click', function() {
			Game.clearTimer(intervalTimer, 'interval');
			Game.clearTimer(timeoutTimer, 'timeout');
			$('.splash').remove();
			var correctAnswer = question.selection;
			var selectedAnswer = $(this).attr('rel');
			if(selectedAnswer == correctAnswer) {
				var newPoints = parseInt($('.points', currentPlayer).text(), 10) - question.value;
				$('.points', currentPlayer).text(newPoints);
			} else {
				console.log('Something happens because your bitch ass just got the question wrong!');
			}
			Game.nextTurn();

			return false;
		});
	},
	clearTimer: function(timer, type) {
		switch(type) {
			case 'interval' :
				$(Game.intervalTimers).each(function(i,e) {
					clearInterval(e);
				});
						
			break;
			case 'timeout' :
				$(Game.timeoutTimers).each(function(i, e) {
					clearTimeout(e);
				});
			break;
		}
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
				var psa = $('<div class="splash"></div>');
				Game.log(data);
				//$('body').prepend(data);
				// $('a[rel=ready]').live('click', function() {
				// 					var playerStatus = setNewPlayer();
				// 					if(playerStatus != null) {
				// 						grabQuestion();
				// 					} else {
				// 						endRound();
				// 					}
				// 
				// 					return false;
				// 				});
			},
			error: function(a, b, error) {
				alert(error);
			}
		});
	}
	
};
var Player = function(args) {
	this.attributes = {
		name: args["name"],
		points: args["points"],
		position: args["position"]
	}
};
