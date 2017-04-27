(function($){

	"use strict";

	$(document).ready(function () {
		$("#popup").hide();
		transfers.init();
	});

	var validateEmail = function (email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

	var validateInfo = function (depDate, pickUp, dropOff, email, isReturn, returnDate, returnPickUp, returnDropOff) {

		  var isValid = true

		 if (depDate.length == 0 || depDate == null || /^\s+$/.test(depDate)) {
			 isValid = false
		 }
		if (pickUp.length == 0 || pickUp == null || /^\s+$/.test(pickUp)) {
			isValid = false
		}
		if (dropOff.length == 0 || dropOff == null || /^\s+$/.test(dropOff)) {
			isValid = false
		}
		if (!validateEmail(email)) {
			isValid = false
		}

		if (isReturn === true) {

			if (returnDate.length == 0 || returnDate == null || /^\s+$/.test(returnDate)) {
				isValid = false
			}
			if (returnPickUp.length == 0 || returnPickUp == null || /^\s+$/.test(returnPickUp)) {
				isValid = false
			}
			if (returnDropOff.length == 0 || returnDropOff == null || /^\s+$/.test(returnDropOff)) {
				isValid = false
			}
		}

		 return isValid
	}

	var showModal = function (message, title) {

		$('#myModal').modal()
		var mymodal = $('#myModal');
		mymodal.find('.modal-body').text(message);
		mymodal.find('.modal-title').text(title);
		mymodal.modal('show');
	}

	var sendEmail = function () {

		var popup = $("#popup");
		popup.show();

		// Vars message
		var depDate = $("#dep-date").val();
		var pickUp = $("#pickUp-location").val();
		var dropOff = $("#dropOff-location").val();
		var email = $("#email-booking").val();
		var isReturn = $("#return").is(":checked");
		var returnDate = $("#ret-date").val();
		var returnPickUp = $("#return-pickUp-location").val();
		var returnDropOff = $("#return-dropOff-location").val();

		if (validateInfo(depDate, pickUp, dropOff, email, isReturn, returnDate, returnPickUp, returnDropOff)) {

			if (isReturn === false) {
				isReturn = "No especifica"
			}

			$.ajax({
				url: "https://formspree.io/abdiel.chaverri@gmail.com",
				method: "POST",
				data: {subject: "Booking", depDat: depDate, pickUp: pickUp, dropOff: dropOff, email:email, isReturn: isReturn, returnDate: returnDate, returnPickUp: returnPickUp, returnDropOff: returnDropOff},
				dataType: "json",
				success: function(data) {
					popup.hide()
					showModal('¡Solicitud enviada de forma exitosa!','Envío');
				},
				error: function (error) {
					popup.hide()
					showModal('Problemas al realizar el envío de la información.','Error');
					console.log(error);
				}
			});
		} else {
			popup.hide();
			showModal('Debe completar todos los campos de forma correcta para hacer la reservación.', 'Requerido');
		}
	}

	$(window).on('load', function() {
		transfers.load();
	});
	
	// ANIMATIONS
	new WOW({
        mobile: false,
    }).init();
	
	var transfers = {
	
		init: function () {

			// MOBILE MENU
			$('.main-nav').slicknav({
				prependTo:'.header .wrap',
				allowParentLinks: true,
				label:''
			});

			$('#sendBooking').click(function () {
				sendEmail();
			});

			// CUSTOM FORM ELEMENTS
			$('input[type=radio], input[type=checkbox],input[type=number], select').uniform();
			
			// SEARCH RESULTS 
			$('.information').hide();
			$('.trigger').click(function () {
				$(this).parent().parent().nextAll('.information').slideToggle(500);
			});
			$('.close').click(function () {
			   $('.information').hide(500);
			});	
			
			// FAQS
			$('.faqs dd').hide();
			$('.faqs dt').click(function () {
				$(this).next('.faqs dd').slideToggle(500);
				$(this).toggleClass('expanded');
			});
			
			// CONTACT FORM
			$('#contactform').submit(function(){
				var action = $(this).attr('action');
				$("#message").show(500,function() {
				$('#message').hide();
				$('#submit')
					.after('<img src="images/contact-ajax-loader.gif" class="loader" />')
					.attr('disabled','disabled');
				
				$.post(action, { 
					name: $('#name').val(),
					email: $('#email').val(),
					comments: $('#comments').val()
				},
				function(data){
					document.getElementById('message').innerHTML = data;
					$('#message').slideDown('slow');
					$('#contactform img.loader').fadeOut('slow',function(){$(this).remove()});
					$('#submit').removeAttr('disabled'); 
				});
				
				});
				return false; 
			});
			
			// TABS
			$('.tab-content').hide().first().show();
			$('.tabs li:first').addClass('active');

			$('.tabs a').on('click', function (e) {
				e.preventDefault();
				$(this).closest('li').addClass('active').siblings().removeClass('active');
				$($(this).attr('href')).show().siblings('.tab-content').hide();
			});

			var hash = $.trim( window.location.hash );
			if (hash) $('.tabs a[href$="'+hash+'"]').trigger('click');
			
			// SMOOTH ANCHOR SCROLLING
			var $root = $('html, body');
			$('a.anchor').on('click', function(e) {
				var href = $.attr(this, 'href');
				if (typeof ($(href)) != 'undefined' && $(href).length > 0) {
					var anchor = '';

					if(href.indexOf("#") != -1) {
						anchor = href.substring(href.lastIndexOf("#"));
					}

					var scrollToPosition = $(anchor).offset().top - 80;

					if (anchor.length > 0) {
						$root.animate({
							scrollTop: scrollToPosition
						}, 1000, function () {
							window.location.hash = anchor;
							// This hash change will jump the page to the top of the div with the same id
							// so we need to force the page to back to the end of the animation
							$('html').animate({ 'scrollTop': scrollToPosition }, 0);
						});
						e.preventDefault();
					}
				}
			});
		
		},
		load: function () {
			// UNIFY HEIGHT
			var maxHeight = 0;
				
			$('.heightfix').each(function(){
				if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
			});
			$('.heightfix').height(maxHeight);	

			// PRELOADER
			$('.preloader').fadeOut();
		}
	}

})(jQuery);