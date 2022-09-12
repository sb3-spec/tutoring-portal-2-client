<script>
	import { onMount, onDestroy } from 'svelte';
	import createAuth0Client from '@auth0/auth0-spa-js';


	import Dashboard from './components/dashboard/Dashboard.svelte'
	import { login, logout } from './auth0/auth';
	import {TutorStore} from './stores/TutorStore';
	
	
	// AUTH0 INIT

	export let auth0 = null;

	$: isLoggedIn = false;
	$: alert = '';

	

	const fetchAuthConfig = () => fetch("https://tutoring-portal-backend.herokuapp.com/auth_config.json"); // "http://localhost:5000/auth_config.json"


	const configureClient = async () => {
		const response = await fetchAuthConfig();
		let config = await response.json(); //


		auth0 = await createAuth0Client({
			domain: config.domain,
			client_id: config.clientId,
			useRefreshTokens: true
		}).catch((err) => {
			console.log(err.message)
		});		
	};

	const handleLogout = async () => {
		if (auth0) {
			await logout(auth0);
			isLoggedIn = false;
		};
	}

	const handleLogin = async () => {
		if (auth0) {
			await login(auth0);
			await checkAuthentication();
		}

	}

	onMount(async () => {
		await configureClient();
		console.log(isLoggedIn)
		
			
		const query = window.location.search;
		
  		if (query.includes("code=") && query.includes("state=")) {

			  // Process the login state
			await auth0.handleRedirectCallback();
			await checkAuthentication();

			let user = await auth0.getUser();

			TutorStore.set(user);

			// Use replaceState to redirect the user away and remove the querystring parameters
			window.history.replaceState({}, document.title, "/");
		};

		if (!isLoggedIn && document.cookie.includes('is.authenticated=true')) {
			await login(auth0);
			TutorStore.set(await auth0.getUser());
		}
	});

	onDestroy(() => {
		unsubscribe();
	})

	const checkAuthentication = async () => {
		isLoggedIn = await auth0.isAuthenticated();
		return isLoggedIn;
	}

</script>

<main>
	
	<div class='app-container'>
		<!-- {#if alert}
			<Alert type
		{/if} -->
		
		{#if isLoggedIn}
			<Dashboard on:alert={(event) => alert = event.detail} on:logout={handleLogout}/>
		{:else}
				
			<button on:click={handleLogin}>Please login</button>
		{/if}
	</div>
</main>

<style>
	.app-container {
		display: flex;
		/* justify-content: center; */
	}
</style>