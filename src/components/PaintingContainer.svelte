<script>
  const zoomImage = e => {
    const image = e.target;

    const modalImage = document.querySelector('.modal-image');
    const modalContainer = document.querySelector('.modal-container');

    if (modalImage) {
      modalImage.src = image.src;
    }

    if (modalContainer) {
      modalContainer.classList.add('flex');
      modalContainer.classList.remove('hidden');
    }
  };
</script>

<button on:click={zoomImage}>
    <slot></slot>
</button>
