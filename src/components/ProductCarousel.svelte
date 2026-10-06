<script>
  /**
   * ProductCarousel — Pixel-perfect carousel that steps exactly one card.
   * Measures the viewport at runtime and translates the track by exact pixels.
   */

  /** @type {{ products: { title: string, slug: string, image: string, basePath: string }[], slidesToShow?: number, autoplaySpeed?: number }} */
  let { products = [], slidesToShow = 4, autoplaySpeed = 5000 } = $props();

  const GAP = 25; // px between cards

  let currentIndex = $state(0);
  let autoplayTimer = $state(null);
  let viewportEl = $state(null);
  let visibleSlides = $state(slidesToShow);
  let stepPx = $state(0); // exact pixels to move per arrow click

  function measure() {
    if (!viewportEl) return;
    const vw = viewportEl.offsetWidth;
    visibleSlides = window.innerWidth <= 768 ? 1 : slidesToShow;
    // Card width = (viewport - gaps) / slides
    // Step = card width + gap = (vw - (n-1)*GAP) / n + GAP = (vw + GAP) / n
    stepPx = (vw + GAP) / visibleSlides;
    // Clamp index
    const max = Math.max(0, products.length - visibleSlides);
    if (currentIndex > max) currentIndex = max;
  }

  $effect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  });

  const maxIndex = $derived(Math.max(0, products.length - visibleSlides));
  const translateX = $derived(currentIndex * stepPx);

  function prev() {
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    resetAutoplay();
  }

  function next() {
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    resetAutoplay();
  }

  function startAutoplay() {
    if (autoplaySpeed <= 0) return;
    autoplayTimer = setInterval(() => {
      currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    }, autoplaySpeed);
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

<div class="carousel-wrapper"
  onmouseenter={stopAutoplay}
  onmouseleave={startAutoplay}
>
  <button class="carousel-arrow arrow-left" onclick={prev} aria-label="Previous">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    </svg>
  </button>

  <div class="carousel-viewport" bind:this={viewportEl}>
    <div
      class="carousel-track"
      style="transform: translateX(-{translateX}px); gap: {GAP}px"
    >
      {#each products as product}
        <a href="{product.basePath}/{product.slug}/" class="carousel-card"
           style="width: calc((100cqw - {GAP * (visibleSlides - 1)}px) / {visibleSlides}); flex: 0 0 auto"
        >
          {#if product.image}
            <div class="card-image">
              <img src={product.image} alt={product.title} loading="lazy" />
            </div>
          {/if}
          <h3 class="card-title">{product.title}</h3>
          <span class="view-link">View Product →</span>
        </a>
      {/each}
    </div>
  </div>

  <button class="carousel-arrow arrow-right" onclick={next} aria-label="Next">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
    </svg>
  </button>
</div>

<style>
  .carousel-wrapper {
    position: relative;
    width: 100%;
    padding: 0 50px;
  }

  .carousel-viewport {
    overflow: hidden;
    width: 100%;
    container-type: inline-size;
  }

  .carousel-track {
    display: flex;
    transition: transform 0.5s ease;
  }

  .carousel-card {
    background: #191919;
    border: 1px solid #454545;
    border-radius: 5px;
    overflow: hidden;
    text-decoration: none;
    color: #fff;
    transition: border-color 0.3s;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 25px;
    flex-shrink: 0;
  }

  .carousel-card:hover {
    border-color: #F1D68F;
  }

  .card-image {
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .carousel-card:hover .card-image img {
    animation: pulse 2s ease-in-out;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .card-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .card-title {
    padding: 10px 0 5px;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    font-family: 'Readex Pro', system-ui, sans-serif;
    color: #fff;
    margin: 0;
  }

  .view-link {
    color: #F1D68F;
    font-size: 15px;
    margin-top: 5px;
    text-decoration: none;
  }

  .carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
    color: #000;
    border: 1px solid #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: transform 0.2s;
  }

  .carousel-arrow:hover {
    transform: translateY(-50%) scale(1.1);
  }

  .arrow-left { left: 0; }
  .arrow-right { right: 0; }

  @media (max-width: 768px) {
    .carousel-wrapper { padding: 0 44px; }
    .carousel-arrow { width: 34px; height: 34px; }
    .card-title { font-size: 16px; }
    .carousel-card { padding: 18px; }
  }
</style>
