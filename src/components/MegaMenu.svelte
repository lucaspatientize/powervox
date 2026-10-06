<script>
  /**
   * MegaMenu — Interactive mega menu for Produtos dropdown
   * Matches Bricks builder design: gold top border, white bg, product grid
   */

  /** @type {{ midbassItems: { title: string, slug: string, image: string }[], subwooferItems: { title: string, slug: string, image: string }[] }} */
  let { midbassItems = [], subwooferItems = [] } = $props();

  let produtosOpen = $state(false);
  let closeTimeout = $state(null);

  function openMenu() {
    if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; }
    produtosOpen = true;
  }

  function scheduleClose() {
    closeTimeout = setTimeout(() => { produtosOpen = false; }, 200);
  }

  function cancelClose() {
    if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; }
  }
</script>

<nav class="main-nav">
  <ul class="nav-items">
    <!-- Produtos with Mega Menu -->
    <li
      class="nav-item has-dropdown"
      onmouseenter={openMenu}
      onmouseleave={scheduleClose}
    >
      <a href="/produtos/" class="nav-link">Produtos</a>

      {#if produtosOpen}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="mega-dropdown"
          onmouseenter={cancelClose}
          onmouseleave={scheduleClose}
        >
          <!-- Mid-Bass Section -->
          <p class="section-label">Linha Mid-Bass</p>
          <div class="product-grid">
            {#each midbassItems as product}
              <a href="/produtos/mid-bass/{product.slug}/" class="product-card">
                <span class="product-name">{product.title}</span>
                {#if product.image}
                  <span class="product-thumb">
                    <img src={product.image} alt={product.title} loading="lazy" />
                  </span>
                {/if}
              </a>
            {/each}
          </div>

          <!-- Subwoofer Section -->
          <p class="section-label">Linha Subwoofers</p>
          <div class="product-grid">
            {#each subwooferItems as product}
              <a href="/produtos/subwoofer/{product.slug}/" class="product-card">
                <span class="product-name">{product.title}</span>
                {#if product.image}
                  <span class="product-thumb">
                    <img src={product.image} alt={product.title} loading="lazy" />
                  </span>
                {/if}
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </li>

    <li class="nav-item">
      <a href="/sobre/" class="nav-link">Sobre</a>
    </li>
    <li class="nav-item">
      <a href="/distribuidores/" class="nav-link">Distribuidores</a>
    </li>
    <li class="nav-item">
      <a href="/contato/" class="nav-link">Contato</a>
    </li>
  </ul>
</nav>

<style>
  .main-nav {
    width: 100%;
  }

  .nav-items {
    display: flex;
    align-items: center;
    gap: 0;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-item {
    position: relative;
  }

  .nav-link {
    display: block;
    padding: 25px 20px;
    color: #f5f5f5;
    font-family: 'Readex Pro', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 400;
    text-decoration: none;
    transition: color 0.2s;
    white-space: nowrap;
  }

  .nav-link:hover {
    color: #F1D68F;
  }

  /* Mega Dropdown */
  .mega-dropdown {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: auto;
    width: 1200px;
    max-width: calc(100vw - 30px);
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    background: #fff;
    border-top: 3px solid #F1D68F;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.12);
    padding: 20px 30px;
    z-index: 1000;
    animation: dropIn 0.2s ease;
  }

  @keyframes dropIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-5px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .section-label {
    font-size: 16px;
    font-weight: 600;
    color: #000;
    margin-bottom: 4px;
    font-family: 'Readex Pro', system-ui, sans-serif;
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    margin-bottom: 12px;
    padding: 6px 0;
  }

  .product-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    border: 1px solid #eee;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    min-width: 0;
  }

  .product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .product-name {
    font-size: 12px;
    color: #000;
    font-family: 'Readex Pro', system-ui, sans-serif;
    flex: 1;
    line-height: 1.2;
  }

  .product-thumb {
    flex-shrink: 0;
  }

  .product-thumb img {
    max-height: 45px;
    width: auto;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    .nav-items {
      flex-direction: column;
      align-items: center;
      gap: 0;
    }

    .nav-link {
      padding: 15px 20px;
    }

    .mega-dropdown {
      display: none;
    }
  }
</style>
