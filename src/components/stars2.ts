const container = document.querySelectorAll(".container");

container.forEach((contain) => {
  contain.addEventListener("mouseenter", () => {
    const stars = contain.querySelectorAll(".star > span");
    stars.forEach((star, index) => {
      star.addEventListener("click", (e) => {
        stars.forEach((innerStar, innerIndex) => {
          if (innerIndex < index) {
            innerStar.style.setProperty("--starPosition", "0%");
          }

          if (innerIndex > index) {
            innerStar.style.setProperty("--starPosition", "100%");
          }
        });
        e.target.style.setProperty("--starPosition", "50%");
      });
    });
  });
});
