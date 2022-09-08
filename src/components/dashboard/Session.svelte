<script>
    import { createEventDispatcher, onDestroy } from 'svelte';

    import {api} from '../../axios';
    import {dateFormatting} from '../../utils/helperFunctions';
    import {ClientStore} from '../../stores/ClientStore';

    export let session = {};
    export let isHeader = false;

    let clientNames = {};

    function clientNameToUUID(clients) {
        for (let client of clients) {
            clientNames[client.uuid] = client.name
        };
    };

    const unsubFromClientStore = ClientStore.subscribe(data => {
        clientNameToUUID(data);
    })

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

    

    onDestroy(() => {
        unsubFromClientStore();
    });
    
</script>


<div class={`session ${isHeader ? 'header' : ''}`} on:click|preventDefault={handleClick}>
    <div class="session-component">
        <p class='date'>{isHeader ? session.date : dateFormatting(session.date)}</p> 
    </div>
    <div class="session-component">
        <p>{isHeader ? session.parent : clientNames[session.clientUuid]}</p> 
    </div>
    <div class="session-component">
        <p>{!isHeader ? '$' : ''}{session.payout}</p> 
    </div>
</div>

<style>
    .session {
        font-family: var(--main-font);
        display: flex;
        font-weight: bold;
        max-width: 500px;
        /* min-width: 400px; */
        justify-content: space-between;
        position: relative;
        transition: all 100ms linear;
        cursor: pointer;
        margin-right: 0;
    }

    .session-component {
        display: flex;
        justify-content: center;
        min-width: 7ch;
    }

    .date { 
        position: relative;
        left: 10px;
    }

    .session:hover {
        box-shadow: rgba(99, 99, 99, 0.2) 0px 5px 10px 1px;
        border-radius: 5px;
    }


    .header {
        color:var(--text-color-secondary);
        font-weight: 300;
        padding-left: 20px;
    }

    .header:hover {
        box-shadow: none;
        cursor: default;
    }

</style>