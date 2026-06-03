/* ========================================================================
   LUMIÈRE GALLERY — Script
   ======================================================================== */

// ---------- Image Data ----------
const galleryImages = [
    {
        src: "images/mountain_lake_sunset.png",
        title: "Golden Horizon",
        category: "landscape",
    },
    {
        src: "images/tropical_coastline.png",
        title: "Emerald Shores",
        category: "landscape",
    },
    {
        src: "images/modern_architecture.png",
        title: "Steel & Glass",
        category: "urban",
    },
    {
        src: "images/butterfly_flower.png",
        title: "Winged Jewel",
        category: "nature",
    },
    {
        src: "images/city_night.png",
        title: "Neon Pulse",
        category: "urban",
    },
    {
        src: "images/autumn_forest.png",
        title: "Amber Path",
        category: "nature",
    },
    {
        src: "images/gourmet_dessert.png",
        title: "Golden Indulgence",
        category: "nature",
    },
    {
        src: "images/lion_savanna.png",
        title: "King of Light",
        category: "wildlife",
    },
    {
        src: "images/zen_garden.png",
        title: "Stillness",
        category: "nature",
    },
    {
        src: "images/milky_way_desert.png",
        title: "Starfield",
        category: "landscape",
    },
    {
        src: "images/coral_reef.png",
        title: "Living Kaleidoscope",
        category: "wildlife",
    },
    {
        src: "images/aurora_mountains.png",
        title: "Northern Veil",
        category: "landscape",
    },
];

// ---------- DOM refs ----------
const grid = document.getElementById("gallery-grid");
const filterBar = document.getElementById("filter-bar");
const counter = document.getElementById("gallery-counter");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxCategory = document.getElementById("lightbox-category");
const lightboxPosition = document.getElementById("lightbox-position");
const lightboxThumbnails = document.getElementById("lightbox-thumbnails");
const btnPrev = document.getElementById("lightbox-prev");
const btnNext = document.getElementById("lightbox-next");
const btnClose = document.getElementById("lightbox-close");
const backdrop = document.getElementById("lightbox-backdrop");

// ---------- State ----------
let currentFilter = "all";
let filteredImages = [...galleryImages];
let lightboxIndex = 0;
let lightboxOpen = false;

// ---------- Build Gallery ----------
function buildGallery() {
    grid.innerHTML = "";

    galleryImages.forEach((img, i) => {
        const item = document.createElement("div");
        item.className = "gallery-item";
        item.dataset.category = img.category;
        item.dataset.index = i;
        item.style.animationDelay = `${i * 0.06}s`;

        item.innerHTML = `
            <img src="${img.src}" alt="${img.title}" loading="lazy" draggable="false">
            <div class="item-overlay">
                <div class="item-expand" aria-label="Open in lightbox">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 3 21 3 21 9"/>
                        <polyline points="9 21 3 21 3 15"/>
                        <line x1="21" y1="3" x2="14" y2="10"/>
                        <line x1="3" y1="21" x2="10" y2="14"/>
                    </svg>
                </div>
                <span class="item-title">${img.title}</span>
                <span class="item-cat">${img.category}</span>
            </div>
        `;

        item.addEventListener("click", () => openLightbox(i));
        grid.appendChild(item);
    });

    applyFilter(currentFilter);
}

// ---------- Category Filter ----------
function applyFilter(category) {
    currentFilter = category;

    // Update active button
    filterBar.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.category === category);
    });

    // Apply filter animation
    grid.classList.add("filtering");

    setTimeout(() => {
        const items = grid.querySelectorAll(".gallery-item");
        let visibleCount = 0;

        items.forEach((item, i) => {
            const match =
                category === "all" || item.dataset.category === category;
            item.classList.toggle("hidden", !match);
            if (match) {
                visibleCount++;
                item.style.animationDelay = `${visibleCount * 0.06}s`;
                // Re-trigger animation
                item.style.animation = "none";
                item.offsetHeight; // force reflow
                item.style.animation = "";
            }
        });

        // Update filtered images for lightbox
        filteredImages =
            category === "all"
                ? [...galleryImages]
                : galleryImages.filter((img) => img.category === category);

        // Counter
        counter.textContent = `Showing ${visibleCount} of ${galleryImages.length} photographs`;

        grid.classList.remove("filtering");
    }, 250);
}

filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    applyFilter(btn.dataset.category);
});

// ---------- Lightbox ----------
function openLightbox(globalIndex) {
    const img = galleryImages[globalIndex];

    // Find position in filtered list
    const filteredIdx = filteredImages.findIndex((fi) => fi === img);
    if (filteredIdx === -1) return;
    lightboxIndex = filteredIdx;

    buildThumbnails();
    showLightboxImage(lightboxIndex);

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
    lightboxOpen = true;
}

function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    lightboxOpen = false;
}

function showLightboxImage(idx) {
    const img = filteredImages[idx];
    if (!img) return;

    // Transition out
    lightboxImage.classList.add("transitioning");

    setTimeout(() => {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.title;
        lightboxTitle.textContent = img.title;
        lightboxCategory.textContent = img.category;
        lightboxPosition.textContent = `${idx + 1} / ${filteredImages.length}`;

        // Transition in
        lightboxImage.classList.remove("transitioning");

        // Update thumbnails
        lightboxThumbnails.querySelectorAll(".thumb-item").forEach((t, i) => {
            t.classList.toggle("active", i === idx);
        });

        // Scroll active thumb into view
        const activeTh = lightboxThumbnails.querySelector(".thumb-item.active");
        if (activeTh) {
            activeTh.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
            });
        }
    }, 180);
}

function buildThumbnails() {
    lightboxThumbnails.innerHTML = "";

    filteredImages.forEach((img, i) => {
        const th = document.createElement("div");
        th.className = "thumb-item";
        th.innerHTML = `<img src="${img.src}" alt="${img.title}" draggable="false">`;
        th.addEventListener("click", () => {
            lightboxIndex = i;
            showLightboxImage(i);
        });
        lightboxThumbnails.appendChild(th);
    });
}

function lightboxPrev() {
    lightboxIndex =
        (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    showLightboxImage(lightboxIndex);
}

function lightboxNext() {
    lightboxIndex = (lightboxIndex + 1) % filteredImages.length;
    showLightboxImage(lightboxIndex);
}

// Button listeners
btnPrev.addEventListener("click", lightboxPrev);
btnNext.addEventListener("click", lightboxNext);
btnClose.addEventListener("click", closeLightbox);
backdrop.addEventListener("click", closeLightbox);

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (!lightboxOpen) return;

    switch (e.key) {
        case "Escape":
            closeLightbox();
            break;
        case "ArrowLeft":
            lightboxPrev();
            break;
        case "ArrowRight":
            lightboxNext();
            break;
    }
});

// Touch / swipe support for lightbox
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener(
    "touchstart",
    (e) => {
        touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
);

lightbox.addEventListener(
    "touchend",
    (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 60) {
            if (diff > 0) lightboxNext();
            else lightboxPrev();
        }
    },
    { passive: true }
);

// ---------- Scroll Reveal ----------
function initReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
    buildGallery();
    initReveal();
});
