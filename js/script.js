// Carrusel infinito Back2Basics

document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.gallery-carousel');
    if (!carousel) return;

    // Botones de navegación
    const btnLeft = document.querySelector('.gallery-nav-left');
    const btnRight = document.querySelector('.gallery-nav-right');

    // Ancho de un cuadro (incluyendo gap)
    function getItemWidth() {
        const first = carousel.querySelector('.art-hang');
        if (!first) return 300;
        const style = window.getComputedStyle(carousel);
        const gap = parseInt(style.gap) || 0;
        return first.offsetWidth + gap;
    }

    function scrollToNext() {
        carousel.scrollBy({ left: getItemWidth(), behavior: 'smooth' });
    }
    function scrollToPrev() {
        carousel.scrollBy({ left: -getItemWidth(), behavior: 'smooth' });
    }

    if (btnLeft) btnLeft.addEventListener('click', scrollToPrev);
    if (btnRight) btnRight.addEventListener('click', scrollToNext);

    // Duplicar los cuadros para efecto infinito
    const items = Array.from(carousel.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone');
        carousel.appendChild(clone);
    });

    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse events
    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('dragging');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('dragging');
    });
    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('dragging');
    });
    carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1.2; // velocidad
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Touch events
    let touchStartX = 0;
    let touchScrollLeft = 0;
    carousel.addEventListener('touchstart', (e) => {
        isDown = true;
        touchStartX = e.touches[0].pageX - carousel.offsetLeft;
        touchScrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('touchend', () => {
        isDown = false;
    });
    carousel.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - touchStartX) * 1.2;
        carousel.scrollLeft = touchScrollLeft - walk;
    });

    // Loop infinito
    carousel.addEventListener('scroll', () => {
        const scrollWidth = carousel.scrollWidth / 2;
        if (carousel.scrollLeft >= scrollWidth) {
            carousel.scrollLeft -= scrollWidth;
        } else if (carousel.scrollLeft <= 0) {
            carousel.scrollLeft += scrollWidth;
        }
    });

    // Centrar el carrusel al cargar
    setTimeout(() => {
        carousel.scrollLeft = carousel.scrollWidth / 4;
    }, 100);
    // Accesibilidad: teclas flecha
    [btnLeft, btnRight].forEach(btn => {
        if (btn) btn.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') btn.click();
        });
    });
});
