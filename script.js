/* =====================================
   GB AUTOS — WEBSITE FUNCTIONALITY
   Car inventory • Search • Photo gallery
   WhatsApp • Floating buttons
===================================== */

"use strict";

/* DEALERSHIP DETAILS */

const GB_AUTOS_PHONE = "2348133357093";

/* YOUR SIX CAR MODELS AND IMAGE COUNTS */

const cars = [
  {
    name: "Toyota Highlander",
    year: "2023",
    price: "Contact for price",
    imagePrefix: "Toyota-Highlander",
    count: 6
  },
  {
    name: "Toyota RAV4",
    year: "2022",
    price: "Contact for price",
    imagePrefix: "Toyota-RAV4",
    count: 6
  },
  {
    name: "Lexus RX350",
    year: "2023",
    price: "Contact for price",
    imagePrefix: "Lexus-RX350",
    count: 5
  },
  {
    name: "Toyota Camry",
    year: "2022",
    price: "Contact for price",
    imagePrefix: "Toyota-Camry",
    count: 4
  },
  {
    name: "Honda Accord",
    year: "2022",
    price: "Contact for price",
    imagePrefix: "Honda-Accord",
    count: 6
  },
  {
    name: "Mercedes-Benz GLK",
    year: "2015",
    price: "Contact for price",
    imagePrefix: "Mercedes-Benz-GLK",
    count: 7
  }
];

/*
IMPORTANT:
The years above are temporary display values.
Change them to the correct years of your actual vehicles.
Prices can also be updated when you provide them.
*/

/* IMAGE PATHS */

function carImagePath(car, number) {
  return `images/${car.imagePrefix}-${number}.png`;
}

/* WEBSITE ELEMENTS */

const carGrid = document.getElementById("carGrid");
const searchInput = document.getElementById("searchInput");
const modelFilter = document.getElementById("modelFilter");
const sortFilter = document.getElementById("sortFilter");
const searchButton = document.getElementById("searchButton");
const emptyState = document.getElementById("emptyState");

const modal = document.getElementById("carModal");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const galleryMain = document.getElementById("galleryMain");
const galleryThumbs = document.getElementById("galleryThumbs");
const modalWhatsApp = document.getElementById("modalWhatsApp");
const closeModalButton = document.getElementById("closeModal");

let lastFocusedElement = null;

/* SAFE IMAGE LOADING */

function setImageWithFallback(img, car, number) {
  const sources = [
    `images/${car.imagePrefix}-${number}.png`,
    `images/${car.imagePrefix}-${number}.jpg`,
    `images/${car.imagePrefix}-${number}.jpeg`,
    `images/${car.imagePrefix}-${number}.webp`
  ];

  let sourceIndex = 0;

  img.onerror = function () {
    sourceIndex++;

    if (sourceIndex < sources.length) {
      img.src = sources[sourceIndex];
    } else {
      img.onerror = null;
      img.removeAttribute("src");
      img.alt = `${car.name} photo ${number} could not be loaded. Check the image filename.`;
      img.classList.add("image-missing");
    }
  };

  img.src = sources[0];
}

/* CREATE CAR CARDS */

function createCarCard(car) {
  const card = document.createElement("article");
  card.className = "car-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "car-image-wrap";

  const image = document.createElement("img");
  image.className = "car-image";
  image.alt = car.name;
  image.loading = "lazy";
  image.decoding = "async";

  setImageWithFallback(image, car, 1);

  const yearBadge = document.createElement("span");
  yearBadge.className = "car-year";
  yearBadge.textContent = car.year;

  const photoBadge = document.createElement("span");
  photoBadge.className = "car-badge";
  photoBadge.textContent = `${car.count} Photos`;

  imageWrap.append(image, yearBadge, photoBadge);

  const info = document.createElement("div");
  info.className = "car-info";

  const title = document.createElement("h3");
  title.textContent = car.name;

  const description = document.createElement("p");
  description.className = "car-description";
  description.textContent = "Exterior and additional vehicle photos";

  const price = document.createElement("div");
  price.className = "car-price";
  price.textContent = car.price;

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const viewButton = document.createElement("button");
  viewButton.type = "button";
  viewButton.className = "btn btn-dark";
  viewButton.textContent = "View Car →";
  viewButton.setAttribute(
    "aria-label",
    `View ${car.name} photos`
  );

  viewButton.addEventListener("click", function () {
    openCarGallery(car);
  });

  actions.append(viewButton);
  info.append(title, description, price, actions);
  card.append(imageWrap, info);

  return card;
}

/* DISPLAY CARS */

function renderCars() {
  if (!carGrid) return;

  const query = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  const selectedModel = modelFilter
    ? modelFilter.value
    : "";

  let filteredCars = cars.filter(function (car) {
    const matchesSearch = car.name
      .toLowerCase()
      .includes(query);

    const matchesModel =
      !selectedModel || car.name === selectedModel;

    return matchesSearch && matchesModel;
  });

  if (sortFilter && sortFilter.value === "name") {
    filteredCars.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  carGrid.innerHTML = "";

  filteredCars.forEach(function (car) {
    carGrid.appendChild(createCarCard(car));
  });

  if (emptyState) {
    emptyState.hidden = filteredCars.length > 0;
  }
}

/* SEARCH AND FILTER EVENTS */

if (searchInput) {
  searchInput.addEventListener("input", renderCars);
}

if (modelFilter) {
  modelFilter.addEventListener("change", renderCars);
}

if (sortFilter) {
  sortFilter.addEventListener("change", renderCars);
}

if (searchButton) {
  searchButton.addEventListener("click", renderCars);
}

/* OPEN CAR DETAILS AND PHOTO GALLERY */

function openCarGallery(car) {
  if (!modal) return;

  lastFocusedElement = document.activeElement;

  modalTitle.textContent = car.name;
  modalPrice.textContent = car.price;

  modalDescription.textContent =
    `Explore the available photos of the ${car.name}. ` +
    "Contact GB Autos for the current price, vehicle condition " +
    "and availability.";

  const message = encodeURIComponent(
    `Hello GB Autos, I am interested in the ${car.name}. ` +
    "Please send me the current price and availability."
  );

  modalWhatsApp.href =
    `https://wa.me/${GB_AUTOS_PHONE}?text=${message}`;

  galleryThumbs.innerHTML = "";

  for (let number = 1; number <= car.count; number++) {
    const thumbnailButton = document.createElement("button");
    thumbnailButton.type = "button";
    thumbnailButton.className = "gallery-thumbnail";
    thumbnailButton.setAttribute(
      "aria-label",
      `View ${car.name} photo ${number}`
    );

    const thumbnail = document.createElement("img");
    thumbnail.alt = `${car.name} photo ${number}`;
    thumbnail.loading = "lazy";
    thumbnail.decoding = "async";

    setImageWithFallback(thumbnail, car, number);

    thumbnailButton.appendChild(thumbnail);

    thumbnailButton.addEventListener("click", function () {
      showGalleryImage(car, number);
    });

    galleryThumbs.appendChild(thumbnailButton);
  }

  showGalleryImage(car, 1);

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (closeModalButton) {
    closeModalButton.focus();
  }
}

/* CHANGE MAIN GALLERY IMAGE */

function showGalleryImage(car, number) {
  if (!galleryMain) return;

  setImageWithFallback(galleryMain, car, number);

  galleryMain.alt = `${car.name} photo ${number}`;

  const buttons = galleryThumbs.querySelectorAll("button");

  buttons.forEach(function (button, index) {
    const active = index === number - 1;

    button.classList.toggle("active", active);

    if (active) {
      button.setAttribute("aria-current", "true");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  const activeButton = buttons[number - 1];

  if (activeButton) {
    activeButton.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest"
    });
  }
}

/* CLOSE GALLERY */

function closeCarGallery() {
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (
    lastFocusedElement &&
    typeof lastFocusedElement.focus === "function"
  ) {
    lastFocusedElement.focus();
  }
}

if (closeModalButton) {
  closeModalButton.addEventListener("click", closeCarGallery);
}

if (modal) {
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeCarGallery();
    }
  });
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && modal && modal.classList.contains("open")) {
    closeCarGallery();
  }
});

/* BACK-TO-TOP BUTTON */

const backTop = document.getElementById("backTop");

function updateBackToTop() {
  if (!backTop) return;

  backTop.classList.toggle(
    "visible",
    window.scrollY > 350
  );
}

window.addEventListener("scroll", updateBackToTop, {
  passive: true
});

if (backTop) {
  backTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* CURRENT YEAR IN FOOTER */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* HERO IMAGE */

const heroImage = document.getElementById("heroImage");

if (heroImage) {
  const heroCar = cars.find(function (car) {
    return car.imagePrefix === "Lexus-RX350";
  });

  if (heroCar) {
    setImageWithFallback(heroImage, heroCar, 1);
  }
}

/* INITIALISE THE WEBSITE */

renderCars();
updateBackToTop();