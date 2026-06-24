/* PANTALLA DE BIENVENIDA */

const splash = document.getElementById("splash");
const splashCta = document.getElementById("splashCta");

if (splash) {
  // Bloqueamos el scroll mientras el splash está visible
  document.body.style.overflow = "hidden";

  function closeSplash() {
    splash.classList.add("splash-exit");

    splash.addEventListener("transitionend", () => {
      splash.remove();
      document.body.style.overflow = "";
      // Aseguramos que siempre empieza desde el principio de la web
      window.scrollTo({ top: 0, behavior: "instant" });
    }, { once: true });
  }

  if (splashCta) {
    splashCta.addEventListener("click", closeSplash);
  }

  // Fallback: si la transición no se detecta, eliminamos a los 900ms
  setTimeout(() => {
    if (splash.classList.contains("splash-exit") && document.body.contains(splash)) {
      splash.remove();
      document.body.style.overflow = "";
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, 900);
}

/* ------------------------------------------------------------ */

const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");
const progressBar = document.getElementById("progressBar");

const navLinks = document.querySelectorAll(".nav-menu a, .side-nav a");
const sectionWatchers = document.querySelectorAll(".section-watch");
const revealElements = document.querySelectorAll(".reveal");

const treeStage = document.querySelector(".tree-stage");
const pageParticles = document.getElementById("pageParticles");

/* MENÚ MÓVIL */

if (menuButton && navMenu) {
  menuButton.addEventListener("click", () => {
    menuButton.classList.toggle("active");
    navMenu.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!menuButton || !navMenu) return;

    menuButton.classList.remove("active");
    navMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

/* SCROLL SUAVE */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (event) {
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

/* BARRA DE PROGRESO */

function updateProgressBar() {
  if (!progressBar) return;

  const scrollTop = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

  progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateProgressBar);
window.addEventListener("load", updateProgressBar);

/* ANIMACIONES AL ENTRAR EN PANTALLA */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.16
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

/* ACTIVAR ENLACE DEL MENÚ SEGÚN SECCIÓN */

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute("id");

      navLinks.forEach((link) => {
        const targetId = link.getAttribute("href").replace("#", "");

        if (targetId === id) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    });
  },
  {
    threshold: 0.35
  }
);

sectionWatchers.forEach((section) => {
  activeSectionObserver.observe(section);
});

/* LUZ AMBIENTAL EN EL PANEL DEL ÁRBOL */

if (treeStage) {
  treeStage.addEventListener("mousemove", (event) => {
    const rect = treeStage.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    treeStage.style.setProperty("--glow-x", `${x}%`);
    treeStage.style.setProperty("--glow-y", `${y}%`);
  });

  treeStage.addEventListener("mouseleave", () => {
    treeStage.style.setProperty("--glow-x", "50%");
    treeStage.style.setProperty("--glow-y", "45%");
  });
}

/* HOJAS Y SEMILLAS FLOTANDO POR TODA LA WEB */

function createAmbientParticles() {
  if (!pageParticles) return;

  pageParticles.innerHTML = "";

  const particleCount = window.innerWidth < 680 ? 18 : 36;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("span");

    const isSeed = i % 5 === 0;
    const isClay = i % 7 === 0;

    particle.classList.add("ambient-leaf");

    if (isSeed) {
      particle.classList.add("ambient-seed");
    }

    if (isClay) {
      particle.classList.add("ambient-clay");
    }

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.setProperty("--duration", `${12 + Math.random() * 14}s`);
    particle.style.setProperty("--delay", `${Math.random() * -20}s`);
    particle.style.setProperty("--drift", `${-120 + Math.random() * 240}px`);
    particle.style.setProperty("--rotation", `${120 + Math.random() * 340}deg`);

    fragment.appendChild(particle);
  }

  pageParticles.appendChild(fragment);
}

createAmbientParticles();

let resizeTimeout;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    createAmbientParticles();
  }, 250);
});