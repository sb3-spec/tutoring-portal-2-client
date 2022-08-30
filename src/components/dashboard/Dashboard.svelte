<script>
    import { createEventDispatcher, onDestroy } from 'svelte';
    import Navbar from '../navbar/Navbar.svelte';
    import MonthlyView from './MonthlyView.svelte';
    import Session from './Session.svelte';
    import {ActiveSectionStore} from '../../stores/ActiveSectionStore';
    import NewSession from '../NewSession.svelte';

    $: activeSection = 'Dashboard';
    let sessionHeaders = {parent: 'Parent', date: 'Date', payout: 'Payout', paid: 'Paid'}

    const unsubscribe = ActiveSectionStore.subscribe(data => {
		activeSection = data
        console.log(data)
	});

    onDestroy(() => {
        unsubscribe();
    });


	const dispatch = createEventDispatcher();

	function forward(event) {
		dispatch('alert', event.detail);
	}

    function handleLogoutEvent(event) {
        dispatch('logout', event.detail);
    }

    $: sessions = []


    // onMount(async() => {
    //     api.get(`api/tutors/${null}`)

    // })

    
</script>

<div class="dashboard-container">
    <Navbar on:logout={handleLogoutEvent}/>
    {#if activeSection === 'Dashboard'}
        <MonthlyView>
            <Session session={sessionHeaders} isHeader={true} on:alert={forward}/>
            {#each sessions as session}
            <Session {session}/>
            {/each}
        </MonthlyView>
    {:else if activeSection === 'New Session'}
        <NewSession />
    {/if}
    <!-- <RecentSessions /> -->
</div>


<style>
    :root {
        --dashboard-height: 750px;
    }
    
    .dashboard-container {
        display: flex;
        width: 82%;
        height: var(--dashboard-height);
        background-color: white;
        margin-top: 115px;
        border-radius: 15px;
        margin-left: 125px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 13px 16px;      
        z-index: 2;
    }

    .dashboard-container::before {
        content: '';
        width: 20%;
        max-width: 250px;
        /* height: var(--dashboard-height); */
        height: calc(var(--dashboard-height) * 1.11); 
        background-color: #EA4C3C;
        border-radius: 20px;
        position: absolute;
        left: 75px;
        top: 80px;
        z-index: -1;
    }
</style>