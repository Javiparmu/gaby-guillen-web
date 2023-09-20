<script>
    import { onMount } from "svelte";

    let headerSection;

    onMount(() => {
        const upButton = document.getElementById('up-button');
        headerSection = document.getElementById('header-section');
        const topSection = document.getElementById('top-section');

        const callback = (entries) => {
            entries.forEach(entry => {
                if ((entry.target === headerSection || entry.target === topSection) && entry.isIntersecting && upButton != null) {
                    console.log('up button hidden');

                    upButton.classList.add('hidden');
                } else if (upButton != null) {
                    console.log('up button visible');

                    upButton.classList.remove('hidden');
                }
            });
        };

        const options = {
            threshold: 0
        };

        const observer = new IntersectionObserver(callback, options);

        if (headerSection != null) observer.observe(headerSection);
        if (topSection != null) observer.observe(topSection);
    });

    const scrollToTop = () => {
        headerSection?.scrollIntoView({ behavior: 'smooth' });
    };
</script>

<button on:click={scrollToTop} id="up-button" aria-label="up-button" class="hidden fixed top-5 md:top-10 right-[50%] translate-x-[50%] px-4 py-2 md:px-5 md:py-3 bg-primary-600 hover:bg-primary-700 rounded-md opacity-40 hover:opacity-100 z-100">
    <svg class="w-4 h-4 md:w-6 md:h-6 text-white" aria-hidden="true" fill="none" viewBox="0 0 14 8">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"/>
    </svg>
</button>
