/**	
	* SinglePro HTML 1.0	
	* Template Scripts
	* Created by WpFreeware Team

	Custom JS
	
	1. Superslides Slider
	2. Fixed Top Menubar
	3. Featured Slider
	4. Skill Circle
	5. Wow animation
	6. Project Counter
	7. TEAM SLIDER
	8. BLOG SLIDER
	9. TESTIMONIAL SLIDER
	10. CLIENTS SLIDER
	11. Google Map
	12. SCROLL TOP BUTTON
	13. PRELOADER 
	14. MENU SCROLL 
	15. MOBILE MENU CLOSE 
	16. Onepage-scroll
	17. Clipboard	
	
**/

jQuery(function($){
	/* ----------------------------------------------------------- */
	/*  7. TEAM SLIDER
	/* ----------------------------------------------------------- */

		$('.team_slider').slick({
		  dots: false,
		  infinite: true,
		  speed: 300,
		  slidesToShow: 4,
		  slidesToScroll: 4,
		  responsive: [
		    {
		      breakpoint: 1024,
		      settings: {
		        slidesToShow: 3,
		        slidesToScroll: 3,
		        infinite: true,
		        dots: true
		      }
		    },
		    {
		      breakpoint: 600,
		      settings: {
		        slidesToShow: 2,
		        slidesToScroll: 2
		      }
		    },
		    {
		      breakpoint: 480,
		      settings: {
		        slidesToShow: 1,
		        slidesToScroll: 1
		      }
		    }
		  ]
		});

	/* ----------------------------------------------------------- */
	/*  12. SCROLL TOP BUTTON
	/* ----------------------------------------------------------- */

	//Check to see if the window is top if not then display button

	  $(window).scroll(function(){
	    if ($(this).scrollTop() > 300) {
	      $('.scrollToTop').fadeIn();
	      $('.scrollToTop').removeClass('reach-top');
	    } else {
	      $('.scrollToTop').addClass('reach-top');
	    }
	    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
	        $('.scrollToTop').addClass('reach-bottom');
	    } else {
	    	$('.scrollToTop').removeClass('reach-bottom');
	    }	
	  });
	   
	  //Click event to scroll to top

	  $('.scrollToTop').click(function(){
	    $('html, body').animate({scrollTop : 0},800);
	    return false;
	  });


});
