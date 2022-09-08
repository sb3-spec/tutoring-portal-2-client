<script>
    import { onDestroy } from "svelte";
    import Widget from "./Widget.svelte";

    import {ClientStore} from "../../stores/ClientStore";

    let clients = [];

    const unsubscribeClients = ClientStore.subscribe(data => {
        clients = data;
    })

    onDestroy(() => {
        unsubscribeClients();
    })
</script>

<Widget>
    <h1>Your Clients</h1>
    <div class="table-header">
        <h2>Name</h2>
        <h2>Email</h2>
    </div>
    {#each clients as client}
        <div class="client-glimpse">
            <h2>{client.name}</h2>
            <h2>{client.email}</h2>
        </div>
    {/each}
</Widget>

<style>
    .client-glimpse, .table-header {
        display: flex;
    }

    .client-glimpse h2 {
        font-weight: 200;
        min-width: 15ch;
    }

    .table-header h2 {
        font-weight: 300 !important;
        border-bottom: 2px solid black;
        margin: 0;
        min-width: 15ch;
    }



</style>