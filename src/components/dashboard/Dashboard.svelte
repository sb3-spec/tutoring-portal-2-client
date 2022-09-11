<script>
    import { createEventDispatcher, onDestroy, onMount } from 'svelte';
    import { scale } from 'svelte/transition';
    import CryptoJS from 'crypto-js';

    import {api} from '../../axios';
    import Navbar from '../navbar/Navbar.svelte';
    import MonthlyView from './MonthlyView.svelte';
    import Session from './Session.svelte';
    import NewSession from '../NewSession.svelte';
    import NewClient from '../NewClient.svelte';
    import PayoutWidget from '../PayoutWidget.svelte';
    import RecentSessions from '../sessions/RecentSessions.svelte';
    import ClientWidget from '../widgets/ClientWidget.svelte';
    import { getOwedByClient } from '../../utils/helperFunctions';
    
    import {ActiveSectionStore} from '../../stores/ActiveSectionStore';
    import {ClientStore} from '../../stores/ClientStore';
    import {TutorStore} from '../../stores/TutorStore';
    import {SessionStore} from '../../stores/SessionStore';
    import {ClientDuesStore} from '../../stores/ClientDuesStore';


    $: activeSection = 'Dashboard';
    $: focusedId = '';
    $: sessions = [];

    let clients = [];
    let tutorEmail = '';

    var today = new Date();

    $: currMonth = today.toLocaleString("en-US", { month: "long" });

    let selectedDate = today.getFullYear() + '-' + (today.getMonth() + 1);

    

    let sessionHeaders = {parent: 'Parent', date: 'Date', payout: 'Payout', paid: 'Paid'}

    const unsubscribe = ActiveSectionStore.subscribe(data => {
		activeSection = data;
	});

    const unsubscribeFromSessionStore = SessionStore.subscribe(data => {
        sessions = data;
        if (sessions.length > 0) {

            let tempDate = new Date(sessions[0].date)
            currMonth = tempDate.toLocaleString("en-US", { month: "long" });
        }
    });

    let clientNames = {}

    function clientNameToUUID(clients) {
        for (let client of clients) {
            clientNames[client.uuid] = client.name
        };
    };

 
    


    onDestroy(() => {
        unsubscribe();
        unsubFromTutorStore();
        unsubscribeFromSessionStore();
    });


	const dispatch = createEventDispatcher();

	function forward(event) {
		dispatch('alert', event.detail);
	}

    function handleLogoutEvent(event) {
        dispatch('logout', event.detail);
    }

  
    async function fetchSessions(date) {
        if (!tutorEmail) {return};

        let uriEncodedDate = encodeURIComponent(date);

        let encryptedText = CryptoJS.AES.encrypt(tutorEmail, 'test').toString();

        let uriEncodedText = encodeURIComponent(encryptedText);

        await api.get(`api/tutors/sessions/${uriEncodedText}/${uriEncodedDate}`).then((res) => {
            SessionStore.set(res.data);
            ClientDuesStore.set(getOwedByClient(res.data, clientNames));
            
        }).catch((err) => {
            console.log(err.message)
        })
    }

    const getClients = async () => {

        if (!tutorEmail) {return};
        let encryptedText = CryptoJS.AES.encrypt(tutorEmail, 'test').toString();

        let uriEncodedText = encodeURIComponent(encryptedText);

        await api.get(`api/tutors/clients/${uriEncodedText}`).then((res) => {
            clients = res.data;
            ClientStore.set(res.data);
        }).catch((err) => {
            console.log(err);
        });
    };

    const unsubFromTutorStore = TutorStore.subscribe(data => {
        tutorEmail = data.email;

        async function fetchDataWithTutorEmail() {
            await getClients();
            clientNameToUUID(clients);
            
            await fetchSessions(selectedDate);

        };

        fetchDataWithTutorEmail();
    });

    const handleMonthChange = (e) => {
        fetchSessions(e.target.value);
    }

    const handleFocusChange = (e) => {
        focusedId = e.detail;


    }


</script>

<div class="dashboard-container">
    <Navbar on:logout={handleLogoutEvent}/>
    <div class="pages">
        {#if activeSection === 'Dashboard'}
            <h1 in:scale >Your {currMonth} So far</h1>
            <input type="month" on:change={handleMonthChange} default={selectedDate}/>
            <Session session={sessionHeaders} isHeader={true} on:alert={forward} {clientNames}/>

            <MonthlyView>
                {#each sessions as session}
                    <Session {session} sessionFocused={focusedId === session.uuid} on:focusChange={handleFocusChange}/>
                {/each}
            </MonthlyView>
            <PayoutWidget />
            <!-- <input type="month" /> -->

        {:else if activeSection === 'New Session'}
            <NewSession {clients}/>
            <RecentSessions />
        {:else if activeSection === 'New Client'}
            <NewClient on:alert={forward}/>
            <ClientWidget />
        {/if}
    </div>
    
</div>


<style>
    :root {
        --dashboard-height: 750px;
    }

    .pages {
        padding-left: 75px;
        width: 100%;
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
        position: relative;
    }

    /* .dashboard-container input {
        position: absolute;
        right: 400px;
    } */

    .dashboard-container::before {
        content: '';
        width: 30%;
        max-width: 250px;
        /* height: var(--dashboard-height); */
        height: calc(var(--dashboard-height) * 1.11); 
        background-color: #EA4C3C;
        border-radius: 20px;
        position: absolute;
        left: -75px;
        top: -50px;
        z-index: -1;
    }

    .dashboard-container::after {
        content: '';
        width: 45%;
        background-color: #F1F1FB;
        position: absolute;
        height: calc(var(--dashboard-height) * 1); 
        right: 0px;
        border-radius: 0 10px 15px 0px;
    }

    .dashboard-container h1{
        padding-left: 20px;

    }

    /* .dashboard-container h1 {
        padding-left: 20px;
    } */
</style>