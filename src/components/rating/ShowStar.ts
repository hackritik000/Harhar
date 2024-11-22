const showcontainer = document.querySelectorAll(".showcontainer");
showcontainer.forEach((contain) => {
  const starDiv = contain.querySelector(".star") as HTMLDivElement;
  const ratingValue = starDiv.dataset.rating;
  const stars = starDiv.querySelectorAll("span");
  stars.forEach((star, index) => {
    if (parseInt(ratingValue) > index) {
      star.style.setProperty("--starPosition", "0%");
    }
    if (parseInt(ratingValue) < index) {
      star.style.setProperty("--starPosition", "100%");
    }
    if (parseInt(ratingValue) == index) {
      const point = parseFloat(ratingValue) - parseInt(ratingValue);
      star.style.setProperty("--starPosition", `${100 - point * 100}%`);
    }
  });
});
