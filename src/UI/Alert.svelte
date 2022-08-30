<script>
    export let type = 'danger';
    export let alertContent;
</script>

<div class={`alert-container ${type}`}>
    {alertContent}
</div>