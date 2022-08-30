<script>
    import { onMount, onDestroy } from 'svelte';
    import {api} from '../axios';
    import { TutorStore } from '../stores/TutorStore';
    import CryptoJS from "crypto-js";

    let clients = [];
    let tutorEmail = '';

    const unsubscribe = TutorStore.subscribe(data => {
        tutorEmail = data.email;
    })


    onMount(async () => {
        if (!tutorEmail) {return}

        let encryptedText = CryptoJS.AES.encrypt(tutorEmail, 'test').toString();

        let uriEncodedText = encodeURIComponent(encryptedText);

        await api.get(`api/tutors/clients/${uriEncodedText}`).then((res) => {
            clients = res.data;
        }).catch((err) => {
            console.log(err.message)
        });
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="new-session">
    <h1>New Session</h1>
    {#each clients as client}
        {client.email}
    {/each}
</div>