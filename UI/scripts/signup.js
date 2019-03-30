// // // CAROUSEL CONTROLLER
// const track = document.querySelector('.carousel_track');
// const slides = Array.from(track.children);
// const nextButton = document.querySelector('.carousel_button-right');
// const prevButton = document.querySelector('.carousel_button-left');

// const slideWidth = slides[0].getBoundingClientRect().width;

// // // Arrange the slides
// const setSlidePosition = (slide, index) => {
//     slide.style.left = slideWidth * index + 'px';
// }
// slides.forEach(setSlidePosition);

// // // //When I click left, move slides to the left 

// const moveToSlide = (track, currentSlide, targetSlide) => {
//     track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
//     currentSlide.classList.remove('current-slide');
//     targetSlide.classList.add('current-slide');
// };

// // // //When I clik right, move slides to the right
// nextButton.addEventListener('click', e => {
//     const currentSlide = track.querySelector('.current-slide');
//     if (currentSlide === slides[slides.length - 1]) {
//         moveToSlide(track, currentSlide, slides[0]);
//     }
//     const nextSlide = currentSlide.nextElementSibling;
//     moveToSlide(track, currentSlide, nextSlide);
// });

// prevButton.addEventListener('click', e => {
//     const currentSlide = track.querySelector('.current-slide');
//     if (currentSlide === slides[0]) {
//         moveToSlide(track, currentSlide, slides[slides.length - 1]);
//     }
//     const prevSlide = currentSlide.previousElementSibling;
//     moveToSlide(track, currentSlide, prevSlide);

// });

// // Add an event to make carousel click/work on its own
// const clickEvent = new MouseEvent('click', { view: window, bubbles: true, cancelable: true, clientX: 20 })

// setInterval(() => {
//     nextButton.dispatchEvent(clickEvent);
// }, 5000);



