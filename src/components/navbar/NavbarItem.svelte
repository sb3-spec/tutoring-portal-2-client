<script>
    import {ActiveSectionStore} from '../../stores/ActiveSectionStore'
    import {onDestroy} from 'svelte';

    export let option;
    export let handleSelect;

    let activeSection = 'Dashboard';

    const unsubscribe = ActiveSectionStore.subscribe(data => {
        activeSection = data;
    });

    onDestroy(() => {
        unsubscribe()
    });


</script>

<li class="nav-item" on:click={handleSelect(option)}>
    <img src={`./images/${option}.png`} alt={`${option} icon`} />
    <p class={activeSection === option ? 'active' : 'disabled'}>{option}</p>
</li>


<style>
    .nav-item {
        list-style: none;
        margin-top: 2em;
        display: flex;
    }

    .nav-item img {
        width: 32px;
        height: 32px;
        position: relative;
        top:10px;
    }

    .nav-item p {
        font-weight: 500;
        font-size: 1.2em;
        transition: all 200ms ease-in-out;
        position: relative;
        left: 10px;
        font-family: "Helvetica", "Helvetica";
    }

    .active {
        color: #393A62;
    }

    .disabled {
        color: #9292AE;
    }

    .nav-item p:hover {
        transform: scale(1.01);
    }

    .nav-item:hover {
        cursor: pointer;
    }

</style>