<script>
    import {scale} from 'svelte/transition'
    export let className = "";
</script>


<div class={`widget ${className}`} in:scale>
    <slot>
        
    </slot>
</div>

<style>

</style>