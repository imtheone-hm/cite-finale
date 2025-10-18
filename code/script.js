// Smooth-scrolling and scrollspy
document.addEventListener('DOMContentLoaded', function(){
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const navList = document.querySelector('.nav-list');
  const toggle = document.querySelector('.nav-toggle');
  const sections = links.map(l => document.querySelector(l.getAttribute('href')));

  // Click handling: smooth scroll (native smooth is enabled via CSS)
  links.forEach(link => {
    link.addEventListener('click', function(e){
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if(!target) return;
      target.scrollIntoView({behavior:'smooth', block:'start'});
      // update active immediately for snappy feedback
      links.forEach(l=>l.classList.remove('active'));
      this.classList.add('active');
      // close mobile menu if open
      if(navList && navList.classList.contains('mobile-open')){
        navList.classList.remove('mobile-open');
        if(toggle) toggle.setAttribute('aria-expanded','false');
      }
    });
  });

  // IntersectionObserver to update active link on scroll
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector('.nav-link[href="#' + id + '"]');
      if(entry.isIntersecting){
        links.forEach(l=>l.classList.remove('active'));
        if(link) {
          link.classList.add('active');
          // center active link in nav
          centerNavLink(link);
        }
      }
    });
  },{root:null,rootMargin:'-40% 0px -40% 0px',threshold:0});

  sections.forEach(s=>{ if(s) observer.observe(s) });

  // Mobile toggle behaviour & keyboard handling
  if(toggle && navList){
    toggle.addEventListener('click', ()=>{
      const open = navList.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      // ensure visible style for mobile
      if(open){ navList.style.display = 'flex' } else { navList.style.display = '' }
    });

    // Close menu on Escape
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && navList.classList.contains('mobile-open')){
        navList.classList.remove('mobile-open');
        toggle.setAttribute('aria-expanded','false');
        navList.style.display = '';
        toggle.focus();
      }
    });
  }

  // helper to center a nav link inside the horizontally-scrollable nav-list
  function centerNavLink(link){
    if(!link || !navList) return;
    // if mobile open, skip centering
    if(navList.classList.contains('mobile-open')) return;
    // prefer native behavior
    try{
      link.scrollIntoView({behavior:'smooth', block:'nearest', inline:'center'});
      return;
    }catch(e){
      // fallback: compute scrollLeft
    }
    const navRect = navList.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const offset = (linkRect.left + linkRect.right)/2 - (navRect.left + navRect.right)/2;
    // adjust scrollLeft by offset
    navList.scrollLeft += offset;
  }

  // Carousel functionality
  const carouselImages = document.querySelectorAll('.carousel-image');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');

  let currentIndex = 0;

  function updateCarousel() {
    carouselImages.forEach((img, index) => {
      img.classList.remove('active');
      if (index === currentIndex) {
        img.classList.add('active');
      }
    });

    const offset = -currentIndex * (carouselImages[0].offsetWidth + 16); // Adjust for image width and gap
    document.querySelector('.carousel-images').style.transform = `translateX(${offset}px)`;
  }

  leftArrow.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
    updateCarousel();
  });

  rightArrow.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % carouselImages.length;
    updateCarousel();
  });

  // Initialize the carousel
  updateCarousel();
});
