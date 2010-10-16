$(function() {
	openingScene();
});

function openingScene() {
	setTimeout(function() {
		// $('#logo').animate({width: '58px', height: '70px'}, 2000, 'easeInBack', function() {
		// 	showWelcomeScreen();
		// });
		$('#logo').fadeOut();
	  showWelcomeScreen();
	}, 2000);
}

function showWelcomeScreen() {
  centerSplashScreen(600, 120);
  $('#welcome').animate({
    width: '600px',
  }, 1000, 'easeOutBounce', function() {
    setButtonControls();
  });
}

function setButtonControls() {
	$('#play_game').click(function() {
		showPlayerSetup();
		return false;
	});
	
	$('#rules_link').click(function() {
		alert('Reading the rules');
		return false;
	});
}

function centerSplashScreen(w, h) {
	$('.splash').css({
		top: "100px",
		left: (( $(window).width() - (w + 60)) / 2+$(window).scrollLeft() + "px")
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
				height: '400px',
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
		var currentPlayerCount = parseInt($(this).siblings('input').attr('name').match(/\d/)[0], 10);
		$(this).parent('.field').remove();
		if(currentPlayerCount > 4) {
			$('#gameform .field:last').append('<a href="#" rel="remove_field"><img src="images/delete-icon.png" alt="Remove Player" /></a>');
		}
		
		return false;
	});
}
