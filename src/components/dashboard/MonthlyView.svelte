<script>
    import {scale, fade} from 'svelte/transition'
    
</script>

<div class="monthly-view" in:scale out:fade>
    <h1 class='dashboard-header'>Your Month So far</h1>
    <slot>

    </slot>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

    .monthly-view {
        margin-top: 2em;
        position: relative;
        left: 2.7em;
        font-family: 'Open Sans', sans-serif;
        overflow-x: hidden;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }



    .monthly-view::-webkit-scrollbar {
        display: none;
    }


    .monthly-view h1 {
        position: relative;
        width: var(--monthly-width);
        left: 100px;
        padding: 0;
    }
</style>