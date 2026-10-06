<script>
  /**
   * ImageGallery — Client photo carousel
   * Arrow overlays, no dots, autoplay, full-bleed
   */

  /** @type {{ images: { src: string, alt: string }[] }} */
  let { images = [] } = $props();

  let currentIndex = $state(0);
  let autoplayTimer = $state(null);

  const slidesToShow = 3;
  const maxIndex = $derived(Math.max(0, images.length - slidesToShow));

  function prev() {
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    resetAutoplay();
  }

  function next() {
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    resetAutoplay();
  }

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    }, 4000);
  }

  function stopAutoplay() {
    if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  $effect(() => {
    startAutoplay();
    return () => stopAutoplay();
  });
</script>

<div
  class="gallery-wrapper"
  onmouseenter={stopAutoplay}
  onmouseleave={startAutoplay}
>
  <div class="gallery-track" style="transform: translateX(-{currentIndex * (100 / slidesToShow)}%)">
    {#each images as image}
      <div class="gallery-slide" style="width: {100 / slidesToShow}%">
        <img src={image.src} alt={image.alt} loading="lazy" />
      </div>
    {/each}
  </div>

  <button class="gallery-arrow arrow-left" onclick={prev} aria-label="Previous">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    </svg>
  </button>

  <button class="gallery-arrow arrow-right" onclick={next} aria-label="Next">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
    </svg>
  </button>
</div>

<style>
  .gallery-wrapper {
    width: 100%;
    overflow: hidden;
    position: relative;
  }

  .gallery-track {
    display: flex;
    transition: transform 0.6s ease;
  }

  .gallery-slide {
    flex-shrink: 0;
  }

  .gallery-slide img {
    width: 100%;
    height: 500px;
    object-fit: cover;
    display: block;
  }

  .gallery-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.35);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.25);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: background 0.2s, transform 0.2s;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .gallery-arrow:hover {
    background: rgba(0, 0, 0, 0.6);
    transform: translateY(-50%) scale(1.08);
  }

  .arrow-left  { left: 16px; }
  .arrow-right { right: 16px; }

  @media (max-width: 768px) {
    .gallery-slide img { height: 260px; }
    .gallery-arrow { width: 36px; height: 36px; }
    .arrow-left  { left: 8px; }
    .arrow-right { right: 8px; }
  }
</style>
