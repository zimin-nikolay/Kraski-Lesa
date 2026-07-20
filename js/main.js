(function () {
  'use strict';

  // ===== Mobile menu =====
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('nav--open');
      burger.classList.toggle('burger--active', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav--open');
        burger.classList.remove('burger--active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===== Product modal =====
  const productCard = document.getElementById('product-card');
  const productModal = document.getElementById('product-modal');

  function openModal(modal) {
    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal(modal) {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  if (productCard && productModal) {
    productCard.addEventListener('click', function (e) {
      if (e.target.closest('.product-eac__code')) return;
      openModal(productModal);
    });

    productCard.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(productModal);
      }
    });

    productModal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        closeModal(productModal);
      });
    });
  }

  // Modal tabs
  const tabs = document.querySelectorAll('.modal__tab');
  const panels = document.querySelectorAll('.modal__panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = tab.dataset.tab;

      tabs.forEach(function (t) {
        t.classList.toggle('modal__tab--active', t === tab);
      });

      panels.forEach(function (panel) {
        panel.classList.toggle('modal__panel--active', panel.dataset.panel === target);
      });
    });
  });

  // ===== Lightbox (gallery + product) =====
  const galleryItems = document.querySelectorAll('.gallery__item');
  const productZoomBtns = document.querySelectorAll('.modal__zoom');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  const galleryImages = Array.from(galleryItems).map(function (item) {
    return {
      src: item.querySelector('img').getAttribute('src'),
      alt: item.querySelector('img').alt
    };
  });

  let lightboxSet = [];
  let currentIndex = 0;

  function getProductImages() {
    return Array.from(document.querySelectorAll('.modal__zoom img')).map(function (img) {
      return {
        src: img.getAttribute('src'),
        alt: img.alt
      };
    });
  }

  function updateLightboxNav() {
    const showNav = lightboxSet.length > 1;
    if (prevBtn) prevBtn.style.display = showNav ? '' : 'none';
    if (nextBtn) nextBtn.style.display = showNav ? '' : 'none';
  }

  function showLightboxImage(index) {
    if (!lightboxSet.length) return;
    currentIndex = (index + lightboxSet.length) % lightboxSet.length;
    lightboxImage.src = lightboxSet[currentIndex].src;
    lightboxImage.alt = lightboxSet[currentIndex].alt;
  }

  function openLightbox(images, index) {
    lightboxSet = images;
    showLightboxImage(index);
    updateLightboxNav();
    lightbox.classList.add('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    lightboxImage.src = '';
  }

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      openLightbox(galleryImages, parseInt(item.dataset.index, 10));
    });
  });

  productZoomBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const index = parseInt(btn.dataset.productIndex, 10);
      openLightbox(getProductImages(), index);
    });
  });

  if (lightbox) {
    lightbox.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        showLightboxImage(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        showLightboxImage(currentIndex + 1);
      });
    }
  }

  // ===== Copy article (EAC) =====
  const toast = document.getElementById('toast');
  var toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('toast--visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('toast--visible');
    }, 2200);
  }

  document.querySelectorAll('.product-eac__code').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var code = btn.dataset.copy || btn.querySelector('.product-eac__number').textContent.replace(/\s/g, '');

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () {
          showToast('Артикул скопирован');
        }).catch(function () {
          showToast('Артикул: ' + code);
        });
      } else {
        showToast('Артикул: ' + code);
      }
    });
  });

  // ===== Team photos (only show if file exists) =====
  document.querySelectorAll('.team-card__photo img').forEach(function (img) {
    var wrap = img.closest('.team-card__photo');

    function showPhoto() {
      if (img.naturalWidth > 0) {
        wrap.classList.add('team-card__photo--visible');
      } else {
        wrap.remove();
      }
    }

    img.addEventListener('load', showPhoto);
    img.addEventListener('error', function () {
      wrap.remove();
    });

    if (img.complete) {
      if (img.naturalWidth > 0) {
        wrap.classList.add('team-card__photo--visible');
      } else {
        wrap.remove();
      }
    }
  });

  // ===== Escape key closes modals =====
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;

    if (lightbox && lightbox.classList.contains('lightbox--open')) {
      closeLightbox();
      return;
    }
    if (productModal && productModal.classList.contains('modal--open')) {
      closeModal(productModal);
    }
    if (nav && nav.classList.contains('nav--open')) {
      nav.classList.remove('nav--open');
      burger.classList.remove('burger--active');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // ===== Header shadow on scroll =====
  const header = document.getElementById('header');

  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 12px rgba(44, 36, 27, 0.08)'
        : 'none';
    }, { passive: true });
  }
})();
