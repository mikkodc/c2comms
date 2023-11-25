$(function () {
  var headerNav = document.querySelector("header nav");
  var menuButton = document.querySelector(".menu-button");
  $(".close").on("click", (ev) => {
    hideNavWindow();
  });

  window.addEventListener("scroll", function (ev) {
    $("header").addClass("opacity-0");
  });

  var cursorInfo = document.getElementById("cursor-info");

  // hide the header when scroll down
  $(window).scroll(function () {
    if ($(window).scrollTop()) {
      $("header").addClass("opacity-0");
    } else {
      $("header").removeClass("opacity-0");
    }
  });

  $(".menu-button").on("click", (ev) => {
    showNavWindow();
  });

  // hide the header nav when blur
  window.addEventListener("click", (ev) => {
    if (!headerNav.contains(ev.target) && !menuButton.contains(ev.target)) {
      hideNavWindow();
    }
  });

  function showNavWindow() {
    $("header nav").removeClass("opacity-0 invisible ");
  }

  function hideNavWindow() {
    $("header nav").addClass("opacity-0 invisible");
  }

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
    translateZ: [0, 85],
    translateY: 5,
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
    offset: -90,
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

  // lenis.on('scroll', (e) => {
  //   console.log(e)
  // })

  // function raf(time) {
  //   lenis.raf(time)
  //   requestAnimationFrame(raf)
  // }

  // requestAnimationFrame(raf)


  // Horizontal Sections
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: "auto",
    spaceBetween: 15,
    autoHeight: true,
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
      snapOnRelease: true,
      dragSize: 390,
    },
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
    });
  });

  // Partners
  const partnersSection = document.querySelector("section.partners")
  gsap.to(infoContainer, {
    opacity:0, 
    display: "none",
    scrollTrigger: {
      trigger: ".partners",
      start: "top top",
      scrub: 1,
      ease: "circ.out",
    }
  })

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
   xPercent: -80,
   opacity: 1,
   scrollTrigger: {
    trigger: '.contact',
    start: "top bottom",
    scrub: 2,
    ease: "circ.out",
   } 
  })
});
