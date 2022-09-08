<script>
    import { onDestroy } from 'svelte';

    import {SessionStore} from '../../stores/SessionStore';
    import {ClientStore} from '../../stores/ClientStore';
    
    import { clientNameToUUID, dateFormatting } from '../../utils/helperFunctions';
    import Widget from '../widgets/Widget.svelte';

    let clientNames = {};
    let sessions = [];

    const unsubscribeSessions = SessionStore.subscribe(data => {

        if (data.length > 5) {
            sessions = data.slice(5);
            return;
        }
        sessions = data;
    });

    const unsubscribeClients = ClientStore.subscribe(data => {
        clientNames = clientNameToUUID(data);
    })

    onDestroy(() => {
        unsubscribeSessions();
        unsubscribeClients();
    })
</script>

<Widget className='recent-sessions'>
    <h1>Recent Sessions</h1>
    <div class="recent-session-item table-header">
        <h2>Name</h2>
        <h2>Date</h2>
        <h2>Payout</h2>
    </div>
    {#each sessions as session}
        <div class="recent-session-item">
            <h2>{clientNames[session.clientUuid]}</h2>
            <h2>{dateFormatting(session.date)}</h2>
            <h2>${session.payout}</h2>
        </div>
    {/each}
</Widget>

<style>
    .recent-session-item {
        display: flex;  
        position: relative;
    }

    .table-header h2 {
        font-weight: 300 !important;
        border-bottom: 2px solid black;
        margin: 0;
    }

    .table-header h2::before {
        border-bottom: 2px solid;
        content: '';
        width: 100px;
        position: absolute;
        bottom: 0;
    }

    .recent-session-item h2 {
        min-width: 15ch;

        font-weight: 200;
    }

    
</style>