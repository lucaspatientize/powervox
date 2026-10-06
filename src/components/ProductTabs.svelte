<script>
  /**
   * ProductTabs — Tab switcher for Mid-Bass / Subwoofers
   * Matches Bricks nested tabs design
   */
  import ProductCarousel from './ProductCarousel.svelte';

  /** @type {{ midbassProducts: any[], subwooferProducts: any[] }} */
  let { midbassProducts = [], subwooferProducts = [] } = $props();

  let activeTab = $state(0);
</script>

<div class="tabs-container">
  <!-- Tab Menu -->
  <div class="tab-menu">
    <button
      class="tab-title"
      class:active={activeTab === 0}
      onclick={() => activeTab = 0}
    >
      Mid-Bass
    </button>
    <button
      class="tab-title"
      class:active={activeTab === 1}
      onclick={() => activeTab = 1}
    >
      Subwoofers
    </button>
  </div>

  <!-- Tab Content -->
  <div class="tab-content">
    {#if activeTab === 0}
      <div class="tab-pane">
        <ProductCarousel products={midbassProducts} />
      </div>
    {:else}
      <div class="tab-pane">
        <ProductCarousel products={subwooferProducts} />
      </div>
    {/if}
  </div>
</div>

<style>
  .tabs-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .tab-menu {
    display: flex;
    justify-content: center;
    gap: 0;
    margin-bottom: 15px;
  }

  .tab-title {
    padding: 15px 35px;
    font-family: 'Readex Pro', system-ui, sans-serif;
    font-size: 20px;
    font-weight: 300;
    text-transform: uppercase;
    color: #f5f5f5;
    background: transparent;
    border: 1px solid #f5f5f5;
    cursor: pointer;
    transition: all 0.3s;
  }

  .tab-title.active {
    background: #fff;
    color: #212121;
    font-weight: 800;
  }

  .tab-title:hover:not(.active) {
    background: rgba(255, 255, 255, 0.1);
  }

  .tab-content {
    width: 100%;
    padding: 20px 0;
  }

  .tab-pane {
    width: 100%;
  }

  @media (max-width: 768px) {
    .tab-title {
      font-size: 15px;
      padding: 12px 20px;
    }
  }
</style>
