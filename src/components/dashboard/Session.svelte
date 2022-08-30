<script>
    import { createEventDispatcher } from 'svelte';

    import {api} from '../../axios';
    export let session = {};
    export let isHeader = false;

    const dispatch = createEventDispatcher();

    async function handleClick() {
        await api.patch(`api/sessions/${session.id}`, {paid: !session.paid}).then((res) => {
            console.log(res.status);
        }).then(() => {
            hasBeenPaid = !hasBeenPaid;
        }).catch((err) => {
            dispatch('alert', 'There was an error processing your request. Please try again later.')
            console.log(err.message);
        });

    };

    $: hasBeenPaid = false;

    
</script>


<div class={`session ${isHeader ? 'header' : ''}`} on:click|preventDefault={handleClick}>
    <p class='date'>{session.date}</p> 
    <p>{session.parent}</p> 
    <p>{!isHeader ? '$' : ''}{session.payout}</p> 
    {#if isHeader}
        <!-- <Button disabled=''>Pay</Button> -->
        <p>Paid</p>
        {:else}
            <p>{hasBeenPaid ? 'Yes' : 'No'}</p>
    {/if}
</div>

<style>
    .session {
        font-family: var(--main-font);
        display: flex;
        font-weight: bold;
        max-width: 700px;
        /* min-width: 400px; */
        justify-content: space-between;
        position: relative;
        left: 20px;
        transition: all 100ms linear;
        cursor: pointer;
        margin-right: 0;
    }

    .date { 
        margin-left: 10px;
    }

    .session:hover {
        box-shadow: rgba(17, 17, 26, 0.05) 4px 10px 15px, rgba(17, 17, 26, 0.1) 0px 0px 8px;
        border-radius: 10px;
    }

    .session p {
        min-width: 9ch;
        padding: 3px;
    }

    .header {
        color:var(--text-color-secondary);
        font-weight: 300;
    }

</style>