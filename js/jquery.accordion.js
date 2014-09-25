/*!
 * Vallenato 1.0
 * A Simple JQuery Accordion
 *
 * Designed by Switchroyale
 * 
 * Use Vallenato for whatever you want, enjoy!
 */

$(document).ready(function()
{
	//Add Inactive Class To All Accordion Headers
	//$('.accordion-header').toggleClass('inactive-header');
	
	//Set The Accordion Content Width
	var contentwidth = $('.accordion-header').width();
	//$('.accordion-content').css({'width' : contentwidth });  //This line was causing a width problem on responsive sizes.
	
	//Open The First Accordion Section When Page Loads
	$('.accordion-header').toggleClass('active-header'); //.toggleClass('inactive-header');
	$('.accordion-content').slideDown().toggleClass('open-content');
	
	// The Accordion Effect
	$('.accordion-header').click(function () {
		if(!$(this).is('.active-header')) {
			//$('.active-header').addClass('active-header').removeClass('inactive-header').next().slideToggle().addClass('open-content');
			$(this).addClass('active-header');//.removeClass('inactive-header');
			$(this).next().slideToggle().toggleClass('open-content');
		}
		
		else {
			$(this).removeClass('active-header'); //.addClass('inactive-header');
			$(this).next().slideToggle().removeClass('open-content');
		}
	});
	
	return false;
});