<script>
    import { createEventDispatcher, onDestroy } from 'svelte';

    import { api } from '../../axios';
    import { dateFormatting, getOwedByClient } from '../../utils/helperFunctions';

    import { ClientStore } from '../../stores/ClientStore';
    import { SessionStore } from '../../stores/SessionStore';
    import { ClientDuesStore } from '../../stores/ClientDuesStore';


    export let session = {};
    export let isHeader = false;
    export let sessionFocused = false;

    let clientNames = {};
    let sessions = [];

    function clientNameToUUID(clients) {
        for (let client of clients) {
            clientNames[client.uuid] = client.name
        };
    };

    const unsubscribeSessions = SessionStore.subscribe(data => {
        sessions = data;
    });

   

    const unsubFromClientStore = ClientStore.subscribe(data => {
        clientNameToUUID(data);
    });

    const dispatch = createEventDispatcher();

    async function handleClick() {
        if (sessionFocused) {
            return dispatch('focusChange', '');
        }
        dispatch('focusChange', session.uuid);
    };

    async function handleDelete() {
        await api.delete(`api/sessions/${session.uuid}`).then((res) => {
            sessions = sessions.filter(session => session.uuid !== res.data);
            SessionStore.set(sessions);
            ClientDuesStore.set(getOwedByClient(sessions, clientNames));
            dispatch('focusChange', '')
            dispatch('alert', 'Session deleted successfully');
            sessionFocused = false;
        }).catch(err => {
            console.log(err);
            dispatch('alert', 'Error deleting session')
        })
    }

    $: hasBeenPaid = false;


    

    onDestroy(() => {
        unsubFromClientStore();
        unsubscribeSessions();
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
{#if !isHeader}
    <div class={`menu ${sessionFocused ? 'session-clicked' : ''}`}>
        <ul>
            <li on:click={handleDelete}><p>Delete Session</p></li>
        </ul>
    </div>
{/if}

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
        overflow: hidden;
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

    .menu p {
        margin: 0;
        font-size: 18px;
    }

    .menu {
        width: 170px;
        overflow: hidden;
        top: 0px;
        left: 300px;
        backdrop-filter: blur(1px);
        transform: translateY(-100%);
        transition: 200ms ease-in-out all;
        opacity: 0;
        pointer-events: none;
        z-index: 10;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 5px 10px 1px;
        border-radius: 5px;
        background-color: var(--text-color-tertiary);
        border: 2px solid rgb(182, 182, 218);
    }

    .menu ul {
        list-style-type: none;
        width: 100%;
        padding: 0;
        margin: 0;
    }

    .menu li {
        display: flex;
        
        height: 100%;
        justify-content: center;
        align-items: center;
        

        margin: 0;
        padding: 0 7px;
    }

    
    .session-clicked {
        transform: translateY(0);
        pointer-events: all;
        cursor: pointer;
        font-weight: bold;
        opacity: 1;
        /* transition: background-color 300ms ease-in-out; */
    }
    
    .session-clicked:hover {
        background-color: rgba(208 52 44 / .7);
        color: rgb(94, 1, 1);
        border: 2px solid rgb(94, 1, 1);
    }


</style>