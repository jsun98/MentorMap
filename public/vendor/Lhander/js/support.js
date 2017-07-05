/*---------------------------------------------------- */
/* Authentication buttons
------------------------------------------------------ */
function handleLoginClick() {
  $("#auth-overlay").fadeIn();
  $('#login-tab-link').click();
  $('html, body').css({
    overflow: 'hidden',
    height: '100%'
  });
}

function handleSignupClick() {
  $("#auth-overlay").fadeIn();
  $('#signup-tab-link').click();
  $('html, body').css({
    overflow: 'hidden',
    height: '100%'
  });
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
   if (event.target == document.getElementById('auth-overlay')) {
       $("#auth-overlay").fadeOut();
       $('html, body').css({
          overflow: 'auto',
          height: 'auto'
        });
   }
}

$('.form').find('input, textarea, select').on('keyup blur focus change', function (e) {

  var $this = $(this),
      label = $this.prev('label');

	  if (e.type === 'keyup') {
			if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
    	if( $this.val() === '' ) {
    		label.removeClass('active highlight');
			} else {
		    label.removeClass('highlight');
			}
    } else if (e.type === 'focus') {
      if( $this.val() === '' ) {
    		label.removeClass('highlight');
			}
      else if( $this.val() !== '' ) {
		    label.addClass('highlight');
			}
    } else if (e.type === "change") {
      if ($this.val() === '') {
        label.removeClass('active highlight');
      } else {
        label.addClass('active highlight');
      }
    }

});

$('.tab a').on('click', function (e) {

  e.preventDefault();

  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');

  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();

  $(target).fadeIn(600);

});
