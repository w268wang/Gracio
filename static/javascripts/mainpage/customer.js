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




function proSlide(){
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
                            }
                            )
}

$(document).ready(function () {
                 "use strict";
    proSlide()
                 });