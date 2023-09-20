<script>
    import { onMount } from 'svelte';
  
    onMount(() => {
        const modalContainer = document.querySelector('.modal-container');

        const handleClick = (e) => {
            if (e.target === modalContainer) {
                modalContainer.classList.add('hidden');
                modalContainer.classList.remove('flex');
            }
        };

        modalContainer?.addEventListener('click', handleClick);

        return () => {
            modalContainer?.removeEventListener('click', handleClick);
        };
    });

    const scrollDown = () => {
        const top = document.getElementById("top-section");

        top?.scrollIntoView({behavior: "smooth"});
    };
</script>

<section id="header-section" class="flex flex-col justify-between">
    <slot></slot>
    <header class="flex flex-col gap-5 md:gap-10 px-5 md:px-0">
        <h1 class="text-8xl md:text-9xl text-center drop-shadow-[1px_1px_4px_rgba(255,255,255,0.5)] shadow-white mt-[37dvh]">Gaby Guillén</h1>
        <h2 class="text-4xl md:text-5xl text-center drop-shadow-[1px_1px_4px_rgba(255,255,255,0.5)] shadow-white">Arte pop</h2>
    </header>
    <svg on:click={scrollDown} id="scroll-button" class="w-[6dvh] h-[6dvh] text-white-800 cursor-pointer animate-bounce mb-1 self-center" aria-hidden="true" fill="none" viewBox="0 0 14 8">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
    </svg>
</section>
  