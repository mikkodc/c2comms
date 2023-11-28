$(function () {
  var headerMain = document.querySelector("header");
  var headerNav = document.querySelector("header nav");
  var menuButton = document.querySelector(".menu-button");
  var cursorInfo = document.getElementById("cursor-info");
  var bgVid = document.getElementById("video-bg");
  var bgVidSource = document.querySelector("#video-bg source");

  $(".close").on("click", (ev) => {
    hideNavWindow();
  });

  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $('header').outerHeight();

  
  // Show Header after Opening Gambit
  const showHeader = gsap.from(headerMain, {
    opacity: 0,
    yPercent: -100,
    paused: true,
    duration: 0.2
  }).progress(1);

  ScrollTrigger.create({
    trigger: "#feat-work",
    start: "top center",
    end: 99999,
    toggleActions: "restart none none reverse",
    onToggle: function() {
      bgVidSource.setAttribute('src', 'src/videos/bg2.webm');
      bgVidSource.setAttribute('type', 'video/webm');
      bgVid.load();
      bgVid.play();
    },
    onUpdate: (self) => {
      if(self.progress > 0) {
        self.direction === -1 ? showHeader.play() : showHeader.reverse()
      } else {
        showHeader.reverse()
      }
    },
  })

  $(".menu-button").on("click", (ev) => {
    showNavWindow();
  });

  // hide the header nav when blur
  window.addEventListener("click", (ev) => {
    if (!headerNav.contains(ev.target) && !menuButton.contains(ev.target)) {
      hideNavWindow();
    }
  });

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
    width: "40%"
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

  // End Header & Nav Functions

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
    translateY: 0,
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
    translateY: 50,
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


  // featured work section
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

  // Smooth Scroll
  // const lenis = new Lenis()

  // function raf(time) {
  //   lenis.raf(time)
  //   requestAnimationFrame(raf)
  // }

  // requestAnimationFrame(raf)


  // Horizontal Sections
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: "auto",
    spaceBetween: 15,
    // autoHeight: true,
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
      snapOnRelease: true,
      dragSize: 390,
    },
    freeMode: true,
    mousewheel: {
      releaseOnEdges: true,
    }
  });

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

  // People Info
  gsap.registerPlugin(ScrollToPlugin)
  let showTeam = document.querySelectorAll(".showTeam");
  let teamInfo = document.querySelectorAll("#people-info .info");
  let infoContainer = document.getElementById("people-info");
  let closeTeamInfo = document.querySelectorAll("#people-info .close");

  showTeam.forEach(function(team, i) {
    team.addEventListener("click", function () {
      gsap.to(window, { scrollTo: "#people-info" });
      // infoContainer.style.height = "auto";
      infoContainer.style.display = "block";
      
      // remove class active
      for (j = 0; j < teamInfo.length; j++){
        if(teamInfo[j].classList.contains('active')) {
          teamInfo[j].classList.remove('active')
        }
      }

      // add active on click
      teamInfo[i].classList.add("active");
  
      closeTeamInfo[0].addEventListener("click", function () {
        infoContainer.style.display = "none";
        teamInfo[i].classList.remove("active");
        teamInfo[i].querySelector('video').pause();
        setTimeout(() => {
          teamInfo[i].children.item(3).classList.remove("active");
        }, 1000);
      });
    });
  });

  // Partners
  const partnersSection = document.querySelector("section.partners")
  // gsap.to(infoContainer, {
  //   opacity:0, 
  //   display: "none",
  //   scrollTrigger: {
  //     trigger: "#people-info",
  //     start: "top top",
  //     scrub: 1,
  //     ease: "circ.out",
  //     markers: true
  //   }
  // })

  // var imageRevealTl = gsap.timeline({
  //   scrollTrigger: {
  //     trigger: ".partners",
  //     start: "top center",
  //     ease: "expo.out",
  //   }
  // })

  // imageRevealTl.to('.partners .reveal-block', {
  //   scaleY: 0,
  //   stagger: 0.25
  // })
  // .from('.partners img', {
  //   duration: 1, 
  //   opacity: 0,
  //   stagger: 0.25
  // }, "-=2")

  var allianceRevealTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".alliances",
      start: "top center",
      ease: "expo.out",
    }
  })

  allianceRevealTl.to('.alliance .reveal-block', {
    scaleY: 0,
    stagger: 0.1
  })
  .from('.alliance img', {
    duration: 1, 
    opacity: 0,
    stagger: 0.1
  }, "-=2")
  

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
   } 
  })

  // Dashboard
  const dashboardTitle = document.querySelector('#dashboard .section-title')
  const dashboardMainImg = document.querySelector('.dashboard-expand__main img')
  const fadeContent = gsap.utils.toArray('#dashboard .fade-content')
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
    }
  })

  dashboardTl
    .set( dashboardTitle , { x: setX, y: setY } )
    .set(dashboardMainImg, {
      scale: 1.4,
      x: 200
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
      // height: "100%"
    }, "+=0.75")
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
          elem.classList.add("active");
          // for (j = 0; j < expandItem.length; j++){
          //   if(expandItem[j].classList.contains('active')) {
          //     expandItem[j].classList.remove('active')
          //   }
          // }
        }
      })
    })

  // Case Studies
  gsap.registerPlugin(ScrollToPlugin)
  let caseStudyCards = gsap.utils.toArray(".case-studies__card");
  let caseStudyScrollbar = document.querySelector('#case-study .swiper-scrollbar');

  const caseStudyTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#case-study',
      start: "center center",
      bottom: "center -=15000",
      pin: true,
      scrub: 1
    }
  })

  caseStudyTl
    .from(caseStudyCards, {
      opacity: 0,
      y: 100,
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

    // Image Scroll Skew
    // let proxy = { skew: 0 },
    // skewSetter = gsap.quickSetter("section img", "skewY", "deg"),
    // clamp = gsap.utils.clamp(-5, 5);

    // ScrollTrigger.create({
    //   onUpdate: (self) => {
    //     let skew = clamp(self.getVelocity() / -100);
    //     // only do something if the skew is MORE severe. Remember, we're always tweening back to 0, so if the user slows their scrolling quickly, it's more natural to just let the tween handle that smoothly rather than jumping to the smaller skew.
    //     if (Math.abs(skew) > Math.abs(proxy.skew)) {
    //       proxy.skew = skew;
    //       gsap.to(proxy, {skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew)});
    //     }
    //   }
    // });

    // gsap.set("section img", {transformOrigin: "right center", force3D: true});

});
