$(function () {
  var headerMain = document.querySelector("header");
  var headerNav = document.querySelector("header nav");
  var menuButton = document.querySelector(".menu-button");
  var cursorInfo = document.getElementById("cursor-info");
  var bgVid = document.getElementById("video-bg");
  var bgVidSource = document.querySelector("#video-bg source");
  
  // Show Header after Opening Gambit
  var showHeader = gsap.to(headerMain, {
    opacity: 1,
    yPercent: 100,
    paused: true,
    duration: 0.2
  });

  // Navigation Events
  $(".menu-button").on("click", (ev) => {
    showNavWindow();
  });
  
  $(".close").on("click", (ev) => {
    hideNavWindow();
  });

  // Hide the header nav when blur
  window.addEventListener("click", (ev) => {
    if (!headerNav.contains(ev.target) && !menuButton.contains(ev.target)) {
      hideNavWindow();
    }
  });

  // Menu Scroll Trigger
  ScrollTrigger.create({
    trigger: "#feat-work",
    start: "top center",
    end: 99999,
    animation: showHeader,
    pinnedContainer: "#feat-work",
    toggleActions: "restart none none reverse",
    onEnter: self => {
      // Change BG Video
      bgVidSource.setAttribute('src', 'src/videos/bg2.webm');
      bgVidSource.setAttribute('type', 'video/webm');
      bgVid.load();
      bgVid.play();
    },
    onUpdate: (self) => {
      // Show Header when it enters '#feat-work' section and after a couple scroll, enable hide on scroll down and show on scroll up
      if(self.progress > 0 && self.progress < 0.004) {
        showHeader.play()
      } else if(self.progress > 0.005) {
        self.direction === -1 ? showHeader.play() : showHeader.reverse()
      } else {
        showHeader.reverse()
      }
    }
  })

  // Navigation Animation
  const menuLabel = document.querySelector(".menu-button__wrapper")
  const menuItems = gsap.utils.toArray(".menu-button .animate")
  const menuNav = document.querySelector(".menu-button nav")

  const menuExpand = gsap.timeline({ paused: true })
  menuExpand.to(menuLabel, {
    opacity: 0,
    y: 20,
    onComplete: function() {
      menuButton.classList.add('active');
    }
  })
  .to(menuButton, {
    width: "30%"
  }, "-=0.25")
  .to(menuButton, {
    height: 650
  })
  .to(menuNav, {
    width: "100%",
    height: "100%",
  })
  .to(menuNav, {
    opacity: 1
  }, "-=0.3")
  .from(menuItems, {
    opacity: 0,
    x: 100,
    stagger: 0.15
  }, "-=1")

  function showNavWindow() {
    menuExpand.play()
  }

  function hideNavWindow() {
    menuExpand.reverse()
  }

  //* Global Animations

  // Title Animations
  gsap.utils.toArray(".section-title .title").forEach(function(elem) {
    const $section = $(elem);
    const $titleBorder = CSSRulePlugin.getRule('.section-title:before')
    var titleChange = gsap.timeline({defaults:{duration: 1}});
    titleChange.from($section, {opacity: 0, y: 100
      })
      .fromTo($titleBorder, {width:"0px", opacity: 0}, {width:"100%", opacity: 1}, "-=0.5")
      
      ScrollTrigger.create({
        trigger: elem,
        start: "top 75%",
        animation: titleChange,
        triggerActions: "restart none reverse pause"
      });
  });

  // Horizontal Section
  // gsap.utils.toArray(".scrollx").forEach(function(elem) {
    
  //   var titleChange = gsap.timeline({defaults:{duration: 1}});
  //   titleChange.from($section, {opacity: 0, y: 100
  //     })
  //     .fromTo($titleBorder, {width:"0px", opacity: 0}, {width:"100%", opacity: 1}, "-=0.5")
      
  //     ScrollTrigger.create({


  // One by One section
  const scenes = document.querySelectorAll(".scene");
  var oneByOne = document.querySelectorAll(".one-by-one > div");
  var words = document.querySelectorAll(".one-by-one > div .words");

  words.forEach((ele) => {
    container = "";
    ele.innerHTML.split(" ").map((word) => {
      container += `<span class="word"> ${word} </span>`;
    });
    ele.innerHTML.replace(ele.innerHTML, container);
    ele.innerHTML = container;
  });

  // create a timeline for the first section
  var tl1 = anime.timeline({
    autoplay: false,
    easing: "cubicBezier(.5, .05, .1, .3)",
  });

  tl1.add({
    targets: oneByOne[0],
    easing: "linear",
    perspective: { value: [100, 100] },
    translateZ: [0, 95],
    translateY: -5,
  });

  words.forEach((ele, i, arr) => {
    let x = 0;
    ele.querySelectorAll(".word").forEach((word, wordIndex, wordArray) => {
      if (i < arr.length) {
        x -= 50;
        tl1.add({
          targets: word,
          opacity: {
            value: [0, 1],
          },
          translateX: [0, 100],
        });
      }
    });

    tl1.add(
      {
        targets: ele,
        opacity: {
          value: [1, 0],
        },
      },
      `+=${i + 1}`
    );
  });

  tl1.add({
    targets: document.getElementById("shout"),
    opacity: {
      value: [0, 1],
    },
    perspective: { value: [100, 100] },
    translateZ: [0, 70],
    translateY: 0,
    duration: 2000,
    easing: "linear",
  });

  tl1.add({
    targets: document.getElementById("shout"),
    opacity: {
      value: [1, 0],
    },
  });

  // create a scene for the first section
  new ScrollMagic.Scene({
    duration: document.querySelector(".one-by-one").children.length * 800,
  })
    .setPin(scenes[0])
    .addTo(new ScrollMagic.Controller())
    .on("progress", (ev) => {
      tl1.seek(tl1.duration * ev.progress);
    });

  setInterval(function () {
    if (
      new DOMMatrixReadOnly(window.getComputedStyle(oneByOne[0]).transform)
        .m43 >= 80
    ) {
      oneByOne[0].classList.add("stroke");
    } else {
      oneByOne[0].classList.remove("stroke");
    }

    if (
      new DOMMatrixReadOnly(window.getComputedStyle(oneByOne[0]).transform)
        .m43 == 95
    ) {
      setTimeout(() => {
        oneByOne[0].firstElementChild.classList.add("wrap");
      }, 100);
    } else {
      oneByOne[0].firstElementChild.classList.remove("wrap");
    }

    if (!detectMouse) {
      cursorInfo.style.left = "-100px";
    }

  }, 10);


  // Featured work section
  var detectMouse = false;
  let featVideo = document.querySelectorAll(".work video");

  featVideo.forEach((ele) => {
    ele.addEventListener("mouseover", (ev) => {
      onmousemove = (ev) => {
        if (detectMouse) {
          cursorInfo.style.top = ev.pageY + "px";
          cursorInfo.style.left = ev.pageX + "px";
          if (cursorInfo.classList.contains("fs-1")) {
            cursorInfo.classList.remove("fs-1");
          }
          cursorInfo.innerHTML = "view project";
        }
      };
      ele.onmouseenter = function () {
        detectMouse = true;
      };
      ele.onmouseleave = (ev) => {
        detectMouse = false;
      };
      featVideo.forEach((v) => {
        v.pause();
      });
      ele.play();
    });
  });

  // featured work section - show video on click
  let showVideo = document.querySelectorAll(".showVideo");
  let workVideo = document.querySelectorAll(".work-video");
  let closeWorkVideo = document.querySelectorAll(".work-video .close");

  // show the video
  showVideo.forEach((video, i) => {
    video.addEventListener("click", function () {
      workVideo[i].classList.add("active");
      workVideo[i].querySelector('video').play();
      setTimeout(() => {
        workVideo[i].children.item(3).classList.add("active");
      }, 800);
    });
  });

  window.addEventListener("scroll", (ev) => {
    ev.preventDefault();
  });

  //close the video
  closeWorkVideo.forEach((close, i) => {
    close.addEventListener("click", function () {
      workVideo[i].classList.remove("active");
      workVideo[i].querySelector('video').pause();
      setTimeout(() => {
        workVideo[i].children.item(3).classList.remove("active");
      }, 1000);
    });
  });

  // pause the video
  var videoStatus = document.querySelectorAll(".vid-status");
  var playing = true;
  document.body.onkeyup = (e) => {
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
      document.querySelectorAll(".work-video").forEach((ele, i) => {
        if (ele.classList.contains("active")) {
          if (ele.children.item(1).paused) {
            ele.children.item(1).play();
            // videoStatus[i].innerHTML = ">";
            // videoStatus[i].classList.add("playing");
            // videoStatus[i].classList.remove("paused");
            playing = true;
          } else {
            ele.children.item(1).pause();
            // videoStatus[i].innerHTML = "||";
            // videoStatus[i].classList.remove("playing");
            // videoStatus[i].classList.add("paused");
            cursorInfo.innerHTML = "&#11208;";
            playing = !playing;
          }
        }
      });
    }
  };

  workVideo.forEach((ele) => {
    ele.onmouseenter = (ev) => {
      detectMouse = true;
      if (!playing) {
        cursorInfo.classList.add("fs-1");
        cursorInfo.innerHTML = "&#11208;";
      } else {
        cursorInfo.style.lef = "-100px";
      }
      onmousemove = (ev) => {
        if (ele.classList.contains("active")) {
          if (detectMouse && !playing) {
            cursorInfo.style.top = ev.pageY + "px";
            cursorInfo.style.left = ev.pageX + "px";
          } else {
            cursorInfo.style.left = "-100px";
          }
        }
      };
    };

    ele.onmouseleave = (ev) => {
      detectMouse = false;
    };
  });

  // Horizontal Sections
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: "auto",
    spaceBetween: 15,
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
      snapOnRelease: true,
      dragSize: 390,
    },
  });

  // People Info
  let showTeam = document.querySelectorAll(".showTeam");
  let teamInfo = document.querySelectorAll("#people-info .info");
  let infoContainer = document.getElementById("people-info");

  showTeam.forEach(function(team, i) {
    team.addEventListener("click", function () {
      gsap.to(window, { scrollTo: "#people-info" });
      infoContainer.style.height = "auto";
      infoContainer.style.display = "block";
      
      // remove class active
      for (j = 0; j < teamInfo.length; j++){
        if(teamInfo[j].classList.contains('active')) {
          teamInfo[j].classList.remove('active')
        }
      }

      // add active on click
      teamInfo[i].classList.add("active");

      setTimeout(function() {
        ScrollTrigger.refresh()
      }, 1000)
    });
  });

  // Dashboard
  const dashboardTitle = document.querySelector('#dashboard .section-title')
  const dashboardMainImg = document.querySelector('.dashboard-expand__main img')
  const dashboardRow = document.querySelector('#dashboard .row')
  const fadeContent = gsap.utils.toArray('#dashboard .section-content')
  let expandItem = document.querySelectorAll(".dashboard-expand__item");

  var setX = $(window).width()/2 - dashboardTitle.offsetWidth/2;
  var setY = $(window).height()/2;
  
  const dashboardTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#dashboard',
      start: "center center",
      bottom: "center center",
      pin: true,
      scrub: 1,
      onLeave: () => {
        ScrollTrigger.refresh()
      }
    }
  })

  dashboardTl
    .set( dashboardTitle , { x: setX, y: setY } )
    .set(dashboardMainImg, {
      scale: 1.3,
      x: 100
    })
    .fromTo(dashboardTitle, { 
      x: setX, 
      y: setY,
      opacity:0, 
      ease:"back.out(5)", 
      duration: 1,
    }, {
      opacity: 1,
      duration: 2
    })
    .to(dashboardTitle, {
      y: 100,
      x: setX, 
      y: 50,
      x: 0,
      width: "94%",
      duration: 3
    })
    .from(fadeContent, {
      opacity: 0,
      y: 100,
      stagger: 0.2,
      duration: 4
    })
    .to(dashboardTitle, {
      y: 0,
      opacity: 0,
      display: "none",
      delay: 2,
      duration: 1
    })
    .to(fadeContent[0], {
      opacity: 0,
      x: -500,
    })
    .set(dashboardMainImg, {
      scale: 1,
      x: 0
    }, "-=0.5")
    .to(fadeContent[0], {
      width: 0,
      display: "none",
    }, "-=0.5")
    .to(fadeContent[1], {
      width: "100%",
    }, "+=0.75")
    .to(dashboardRow, { top: 0 })
    .to(dashboardMainImg, {
      scale: 0.65,
      x: 0,
    })
    .from(expandItem, {
      opacity: 0,
      y: 100,
      stagger: 0.6,
      delay: 0.5,
      duration: 5
    })

    expandItem.forEach(function(elem, i) {
      elem.addEventListener("click", function () {
        if(elem.classList.contains('active')) {
          elem.classList.remove('active')
        } else {
          for (j = 0; j < expandItem.length; j++){
            if(expandItem[j].classList.contains('active')) {
              expandItem[j].classList.remove('active')
            }
          }
          elem.classList.add("active");
        }
      })
    })

  // Case Studies  
  let caseStudyCards = gsap.utils.toArray(".case-studies__card");
  let caseStudyScrollbar = document.querySelector('#case-study .swiper-scrollbar');

  const caseStudyTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#case-study',
      start: "center center",
      bottom: "center",
      pin: true,
      scrub: 1,
      onLeave: () => {
        ScrollTrigger.refresh()
      }
    }
  })

  caseStudyTl
    .from(caseStudyCards, {
      opacity: 0,
      y: 0,
      stagger: 0.2,
      duration: 2
    }, "+=1")
    .to(caseStudyCards[0], {
      left: 0
    }, "+=0.5")
    .to(caseStudyCards[3], {
      left: 1800,
      delay: 1
    })
    .to(caseStudyCards[1], {
      left: 600
    }, "+=0.5")
    .to(caseStudyCards[2], {
      left: 1200
    }, "+=0.5")
    .from(caseStudyScrollbar, {
      opacity: 0,
      y: 100
    }, "+=2")

  caseStudyCards.forEach(function(card) {
    const cardButton = card.querySelector('.arrow-upright')

    cardButton.addEventListener("click", function(e) {
      const cardAnimate = card.querySelectorAll('.animate')
      const cardFace = card.querySelectorAll('.case-studies__face')

      const flipCard = gsap.timeline({ defaults: {duration: 0.5} });

      flipCard.to(cardAnimate, {
        opacity: 0,
        y: 100,
        stagger: 0.15
      }).to(cardFace, { rotationY:"+=180", duration: 1.5 })
      .to(cardFace[1], { scale: 10, duration: 1}, "-=1")
    })
  })

  // Alliance
  function animateImg(element) {
    element.forEach((imgItem) => {
      const imgInner = imgItem.querySelector('.reveal-inner')
      const imgBl = imgItem.querySelector('.reveal-bl')
      const imgImg = imgItem.querySelector('.reveal-bl img')
  
      let imgRevealTl = gsap.timeline({
        scrollTrigger: {
          trigger: imgItem,
          start: "top bottom",
          toggleActions: "play none none none"
        }
      })
      imgRevealTl.set(imgInner, { clipPath: "polygon(100% 0%, 100% 0%, 0% 0%, 0% 0%)"})
      imgRevealTl.set(imgBl, { clipPath: "polygon(100% 0%, 100% 0%, 0% 0%, 0% 0%)"})
      imgRevealTl.from(imgItem, 1, { opacity: 0, translateY: "80px", ease: "expo.out" })
      imgRevealTl.to(imgInner, 0.5, { clipPath: "polygon(100% 100%, 100% 0%, 0% 0%, 0% 100%)", ease: "expo.out" })
      imgRevealTl.to(imgInner, 0.5, { clipPath: "polygon(100% 100%, 100% 100%, 0% 100%, 0% 100%)", ease: "expo.out" })
      imgRevealTl.to(imgBl, 0.5, { clipPath: "polygon(100% 100%, 100% 0%, 0% 0%, 0% 100%)", ease: "expo.out" }, "-=0.5")
      imgRevealTl.from(imgImg, 2, { opacity: 0, scale: 0.75, ease: "expo.out" }, "-=0.5")
    })
  }

  let imgReveal = gsap.utils.toArray('.img-reveal')
  let navTab = document.querySelectorAll('.nav .nav-link')

  // Animate Images of Nav Tab Open
  navTab.forEach(function(item) {
    item.addEventListener("click", (e) => {
      let activeNavImg = gsap.utils.toArray('.tab-pane.active .img-reveal')
      animateImg(activeNavImg)
    })
  })
  
  // Animate Images on viewport show
  animateImg(imgReveal)

  
  // Contact Us Marquee
  const contactMarquee = document.querySelector('.contact ul')

  gsap.fromTo(contactMarquee, {
    xPercent: 50,
    opacity: 0.5
  },{
   xPercent: -50,
   opacity: 1,
   scrollTrigger: {
    trigger: '#contact',
    start: "top bottom",
    end: "bottom center",
    scrub: 2,
    ease: "circ.out",
    // markers: true
   } 
  })

});
