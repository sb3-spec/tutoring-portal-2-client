<script>
    import { onDestroy } from 'svelte';

    import {SessionStore} from '../stores/SessionStore';
    import {ClientStore} from '../stores/ClientStore';
    import {ClientDuesStore} from '../stores/ClientDuesStore';
import Widget from './widgets/Widget.svelte';

    let clientDues = {};

    let clientNames = {};

    const unsubscribeClientDuesStore = ClientDuesStore.subscribe(data => {
        clientDues = data;
    });

    function clientNameToUUID(clients) {
        for (let client of clients) {
            clientNames[client.uuid] = client.name;
        };
    };

    

    const unsubscribeFromClientStore = ClientStore.subscribe(data => {
        clientNameToUUID(data);
    })
    


    function getSum(dues) {
        let sum = 0;
        for (let client of Object.keys(dues)) {
            sum += clientDues[client];
        }
        
        return sum;
    }

    onDestroy(() => {
        unsubscribeFromClientStore();
        unsubscribeClientDuesStore();
    })


</script>

<Widget className="client-dues">
    <h1>Client Dues</h1>
    <div class="table-header">
        <h2>Name</h2>
        <h2>Due</h2>
    </div>
    {#each Object.keys(clientDues) as clientName}
        <div class='payout-item'><h2 class='client-name'>{clientName}:</h2><h2>${clientDues[clientName]}</h2></div>
    {/each}
    <div class='payout-item footer'><h2 class='client-name'>Total:</h2><h2>${getSum(clientDues)}</h2></div>
</Widget>

<style>
    .payout-item {
        min-width: 300px;
        display: flex;     
        margin: 0;   
    }

    .table-header {
        display: flex;
        margin: 0;
    }

    .table-header h2 {
        font-weight: 300 !important;
        border-bottom: 2px solid black;
        margin: 0;
        min-width: 15ch;
    }

    .footer h2 {
        border-top: 2px solid black;
        padding-top: 4px;
        margin: 0
    }

    .payout-item h2 {
        font-weight: 200;
        min-width: 15ch;
    }

    .client-name {
        font-weight: bold;
        
    }

</style>