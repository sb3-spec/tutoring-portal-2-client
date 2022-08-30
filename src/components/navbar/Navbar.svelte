<script>
    import { fade, scale } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    import {ActiveSectionStore} from '../../stores/ActiveSectionStore';
    import NavbarItem from './NavbarItem.svelte';

    const dispatch = createEventDispatcher();

    
    let activeSection = 'Dashboard';

    const options = [
        'Dashboard',
        'New Session',
        'New Client'
    ];

    const handleDispatch = () => {
        dispatch('logout')
    };
    const handleSectionChange = (option) => {
        ActiveSectionStore.set(option)
    };
    

   


    
</script>

<div class="navbar">
    {#each options as option}
        <ul in:scale out:fade>
            <NavbarItem handleSelect={handleSectionChange} {option} {activeSection}/>
        </ul>
    {/each}
    <button on:click={handleDispatch}><img src='./images/logout.png' alt="logout icon"/></button>
</div>

<style>

    .navbar {
        background-color:  #F1F1FB;     
        box-shadow: none; 
        z-index: 2;
        border-radius: 15px 0 0 15px;
        width: 250px;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 16px -10px;
        position: relative;
    }

    .navbar button {
        position: absolute;
        bottom: 0;
        left: 15px;
        border: none;
        background-color: inherit;
    }

    .navbar img {
        height: 30px;
        width: 30px;
        cursor: pointer;
    }

    .navbar img:hover {
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-radius: 5px;
    }

    .navbar ul {
        position: relative;
        top: 150px;
    }
</style>