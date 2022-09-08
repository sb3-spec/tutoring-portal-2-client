<script>
    import { onMount, onDestroy } from 'svelte';
    import { scale } from 'svelte/transition';
    import { Form, Field, ErrorMessage } from "svelte-forms-lib";
    import * as yup from 'yup';
    
    import {SessionStore} from '../stores/SessionStore';
    import {ClientStore} from '../stores/ClientStore';
    import { api } from '../axios';
    

    
    let sessions = [];
    let clients = [];
    let selectedClientUuid = '';

    const unsubscribeFromClientStore = ClientStore.subscribe(data => {
        clients = data
        
        if (clients) {
            selectedClientUuid = clients[0].uuid;
        }
    });

    const unsubscribeFromSessionStore = SessionStore.subscribe(data => {
        sessions = data;
    });

    onDestroy(() => {
        unsubscribeFromClientStore();
        unsubscribeFromSessionStore();
    });

    const formProps = {
        initialValues: {
            length: 1,
            date: new Date()
        },
        validationSchema: yup.object().shape({
            length: yup.number().required("The session length is required"),
            date: yup.date().required("The session's date is required"),
        }),

        onSubmit: sessionData => {
            sessionData.clientUuid = selectedClientUuid;
            sessionData.payout = sessionData.length * getClientRate(sessionData.clientUuid);

            api.post('api/sessions', sessionData).then((res) => {
                console.log('Session successfully added');
                console.log(res.data);
                SessionStore.set([...sessions, res.data]);
            }).catch((err) => {
                console.error(err);
            })
        }
    }

    const handleChange = (e) => {
        selectedClientUuid = e.target.value;
    }

    function getClientRate(clientId) {
        for (let client of clients) {
            if (client.uuid === clientId) {
                return client.rate;
            }
        }
        return 0;
    }


    
</script>

<div class="new-session" in:scale>
    <h1>New Session</h1>
    <label for="clients">Choose a client</label>
    <select name="client-select" id="clients" on:change={handleChange}>
        {#each clients as client}
            <option value={client.uuid}>{client.name}</option>
        {/each}
    </select>

    <Form {...formProps}>
        <label for="date">Date</label>
        <Field type="date" name='date'/>
        <ErrorMessage name='date' />

        <label for='length'>Session Length</label>
        <Field type="number" name='length'/>
        <ErrorMessage name='length' />
        <button type="submit">Submit Session</button>
    </Form>
</div>

<style>
    .new-session {
        position: relative;
    }

    .new-session::after {
        content: "";
        color: blue;
    }
</style>