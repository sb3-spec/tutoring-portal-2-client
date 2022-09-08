<script>
    import {scale, fade} from 'svelte/transition'
    
</script>

<div class="monthly-view" in:scale>
    <slot>

    </slot>
    
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
    
    .monthly-view {
        margin-top: .5em;
        position: relative;
        font-family: 'Open Sans', sans-serif;
        overflow-x: hidden;
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
        height: 75%;
        padding-left: 20px;
        padding-top: 10px;
        max-width: 780px;
        margin-right: 0;
    }

    .monthly-view::-webkit-scrollbar {
        display: none;
    }

</style>