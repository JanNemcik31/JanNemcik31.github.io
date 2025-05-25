const parallax_el = document.querySelectorAll(".parallax");

let xValue = 0, 
    yValue = 0;

let rotateDegree = 0;

function update(cursorPosition) {
    parallax_el.forEach((el) => {
        let speedx = el.dataset.speedx;
        let speedy = el.dataset.speedy;
        let speedz = el.dataset.speedz;
        let rotateSpeed = el.dataset.rotation;

        
        let isInLeft = 
            parseFloat(getComputedStyle(el).left) < window.innerWidth / 2 ? 1 : -1;            
        let zValue = 
            (cursorPosition - parseFloat(getComputedStyle(el).left)) * isInLeft * 0.15;


        el.style.transform = `perspective(1200px) translateZ(${
            zValue * speedz
        }px) rotateY(${rotateDegree * rotateSpeed}deg) translateX(calc(-50% + ${
            -xValue * speedx
        }px)) translateY(calc(-50% + ${-yValue * speedy}px))`;
    });
}

update()

window.addEventListener("mousemove", (e) => {
    if(timeline.isActive()) return;

    xValue = e.clientX - window.innerWidth / 2;
    yValue = e.clientY - window.innerHeight / 2;
    
    rotateDegree = (xValue / (window.innerWidth / 2)) * 20;

    update(e.clientX);
});



let timeline = gsap.timeline();

Array.from(parallax_el)
    .filter(el => !el.classList.contains("text"))
    .forEach((el) => {
    let distance = parseFloat(+el.dataset.distance); 
    timeline.from(
        el, 
        {
            top: `${el.offsetHeight / 2 + distance}px`,
            duration: 2.5,
            ease: "power3.out",
        },
        "2"         
    );
});

timeline.from(
    ".text h1", 
    {
        y: 
            window.innerHeight - 
            document.querySelector(".text h1").getBoundingClientRect().top,
            duration: 2,
    },
    "2.5"
).from(
    ".text h2",
    {
        y: -150,
        opacity: 0,
        duration: 1.5,
    },
    "2"
)

