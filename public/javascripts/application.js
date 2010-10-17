$(function() {
	openingScene();
	moveClouds();
	$(window).keydown(function(event) {
		if(event.keyCode == 13) {
			$('.go').click();
		}
	});	
});

function openingScene() {
	if($.support.cssFloat) {
		setTimeout(function() {
			$('#logo').animate({width: '58px', height: '70px'}, 2000, 'easeInBack', function() {
				showWelcomeScreen();
			});
			$('#logo').fadeOut();
		}, 2000);
	} else {
		// Player is using IE
		var sign = $('<div id="ieblock"></div>');
		sign.html('<p>Sorry, but the browser you\'re using is not supported. <small>(yet)</small></p>');
		sign.css({
			width: ($(window).width() + 'px'),
			height: ($(window).height() + 'px')
		});
		sign.append('<br /><a href="http://www.google.com/chrome">Download Chrome</a>');
		sign.append('<br /><a href="http://www.mozilla.com/en-US/">Download Firefox</a>');
		sign.append('<br /><a href="http://www.apple.com/safari/download/">Download Safari</a>');
		$('body').append(sign);
		$('#ieblock').slideDown(10000);
	}
}

function moveClouds() {
	setInterval(function() {
		$('body').stop(true, true).animate({
			'background-position': "-=1px 0%, center bottom"
		});
	}, 300);
	
}

function showWelcomeScreen() {
  centerSplashScreen(600, 120);
  $('#welcome').fadeIn();
  setButtonControls();
}

function setButtonControls() {
	$('#play_game').click(function() {
		showPlayerSetup();
		return false;
	});
	$('#rules_link').click(function() {
		showRulesScreen();
		return false;
	});
	$('#terms_link').click(function() {
		showTermsScreen();
		return false;
	});
	$('#faq_link').click(function() {
		showFAQScreen();
		return false;
	});
}

function centerSplashScreen(w, h) {
	$('.splash').css({
		top: "100px",
		left: (( $(window).width() - (w + 60)) / 2+$(window).scrollLeft() + "px")
	});
}

function showRulesScreen() {
	$('.splash').remove();
	$.ajax({
		url: '/official_rules',
		dataType: 'html',
		type: 'GET',
		success: function(data) {
			$('body').prepend(data);
			$('.splash').css({
				width: '600px',
				top: "100px",
				left: (( $(window).width() - 650) / 2+$(window).scrollLeft() + "px")
			});
			$('.splash').fadeIn('fast');

	    $('a#back_to_game').live('click', function() {
	      returnToHome();
				return false;
      });
		},
		error: function(a, b, error) {
			alert(error);
		}
	});
}
function showTermsScreen() {
	$('.splash').remove();
	$.ajax({
		url: '/terms_and_conditions',
		dataType: 'html',
		type: 'get',
		success: function(data) {
			$('body').prepend(data);
			$('.splash').css({
				width: '600px',
				top: "100px",
				left: (( $(window).width() - 650) / 2+$(window).scrollLeft() + "px")
			});
			$('.splash').fadeIn('fast');
			$('a#back_to_game').live('click', function() {
	      returnToHome();
				return false;
      });
		},
		error: function(a,b,error) {
			alert(error);
		}
	});
}
function showFAQScreen() {
	$('.splash').remove();
	$.ajax({
		url: '/faq',
		dataType: 'html',
		type: 'get',
		success: function(data) {
			$('body').prepend(data);
			$('.splash').css({
				width: '600px',
				top: "100px",
				left: (( $(window).width() - 650) / 2+$(window).scrollLeft() + "px")
			});
			$('.splash').fadeIn('fast');
			$('a#back_to_game').live('click', function() {
	      returnToHome();
				return false;
      });
		},
		error: function(a,b,error) {
			alert(error);
		}
	});
}
function returnToHome() {
	$('.splash').remove();
  $.ajax({
		url: '/welcome_screen',
		dataType: 'html',
		type: 'get',
		success: function(data) {
			$('body').prepend(data);
			centerSplashScreen(600, 120);
		  $('#welcome').fadeIn();
	    setButtonControls();
		},
		error: function(a,b,error) {
			//failsafe
			window.location = window.location.href;
		}
	});
}

function showPlayerSetup() {
	$('.splash').remove();
	$.ajax({
		url: '/player_setup_form',
		dataType: 'html',
		type: 'GET',
		success: function(data) {
			$('body').prepend(data);
			$('.splash').css({
				width: '600px',
				top: "100px",
				left: (( $(window).width() - 650) / 2+$(window).scrollLeft() + "px")
			});
			addPlayerField();
			removePlayerField();
			$('.splash').fadeIn('fast');
			
			Game.init();
		},
		error: function(a, b, error) {
			alert(error);
		}
	});
}

function addPlayerField() {
	$('a[rel^=add_field]').live('click', function() {
		var addLink = this;
		var lastfield = $('#gameform .field:last');
		$('a', lastfield).remove();
		var field = $(lastfield).clone();
		var currentPlayerCount = parseInt($('label', field).text().match(/\d/)[0], 10);
		var newPlayer = 'player_' + (currentPlayerCount +1);
		$('label', field).text('Player ' + (currentPlayerCount + 1));
		$('input', field).val('');
		$(field).append('<a href="#" rel="remove_field"><img src="images/delete-icon.png" alt="Remove Player" /></a>');
		$('label', field).attr('for', newPlayer);
		$('input', field).attr({
			'name': newPlayer,
			'id': newPlayer
		});
		$('#gameform .field:last').after(field);
		if((currentPlayerCount +1) >= 8) {
			$(addLink).hide();
		}
		return false;
	});
}

function removePlayerField() {
	$('a[rel^=remove_field]').live('click', function() {
		$('a[rel^=add_field]').show();
		var currentPlayerCount = parseInt($(this).siblings('input').attr('name').match(/\d/)[0], 10);
		$(this).parent('.field').remove();
		if(currentPlayerCount > 4) {
			$('#gameform .field:last').append('<a href="#" rel="remove_field"><img src="images/delete-icon.png" alt="Remove Player" /></a>');
		}
		
		return false;
	});
}
