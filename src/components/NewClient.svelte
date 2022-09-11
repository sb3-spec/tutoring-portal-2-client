<script>
    import {createEventDispatcher, onDestroy} from 'svelte';
    import { fade, scale } from 'svelte/transition';
    import { Form, Field, ErrorMessage } from "svelte-forms-lib";
    import * as yup from 'yup';

    import { TutorStore } from '../stores/TutorStore';
    import {api} from '../axios';
    import { ClientStore } from '../stores/ClientStore';

    let tutorEmail = null;
    let clients = [];

    const unsubscribe = TutorStore.subscribe(data => {
        tutorEmail = data.email;
    })

    const unsubscribeClients = ClientStore.subscribe(data => {
        clients = data;
    });

    const formProps = {
        initialValues: {
            name: "",
            email: "",
            rate: 40
        },

        validationSchema: yup.object().shape({
            name: yup.string().required("The client's name is required"),
            email: yup.string().required("The client's email is required"),
            rate: yup.number().required("The client's rate is required'")
        }),
         onSubmit: values => {

            values.tutorEmail = tutorEmail

            api.post('api/clients', values).then((res) => {
                ClientStore.set([...clients, res.data]);
                dispatch('alert', 'Client successfully created')
            }).then((res) => {
                console.log(res.status)
            }).catch((err) => {
                dispatch('alert', 'Error creating client')
            })
        }
    }


    const dispatch = createEventDispatcher();

    onDestroy(() => {
        unsubscribe();
        unsubscribeClients();
    });
</script>


<div class="new-client" in:scale>
    <h1>New Client</h1>
    <Form {...formProps} id="new-client">
        <label for="name">Client Name</label>
        <Field name="name" value="" placeholder="" type="text"/>
        <div class="error">
            <ErrorMessage name="name" />
        </div>

        <label for="email">Client email</label>
        <Field value="" name='email' placeholder="" type="email"/>
        <div class="error">
            <ErrorMessage name="email" />
        </div>

        <label for="rate">Client Rate</label>
        <Field value=30 name="rate" placeholder="30" type="number" />
        <div class="error">
            <ErrorMessage name="rate" />
        </div>

        <button type="submit">Submit</button>
    </Form>
</div>

<style>

    .new-client {
        position: relative;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        width: fill;
    }

    .error {
        color: red;
    }
</style>