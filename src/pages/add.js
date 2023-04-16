import * as Yup from 'yup';
import { useState } from "react";
import { useForm, yupResolver } from '@mantine/form';
import { DateInput } from '@mantine/dates';
import { TextInput, Box, Group, Button } from '@mantine/core';
import { useAuth } from "@clerk/nextjs";
import { addPantry } from "@/modules/Data";
import { useRouter } from "next/router";



export default function Add(){
    const schema = Yup.object().shape({
        name: Yup.string().required(),
        group: Yup.string().required(),
        quantity: Yup.string(),
        expiration: Yup.date()
    });

    const form = useForm({ validate: yupResolver(schema), initialValues: { name: '', group: '', quantity: '', expiration: ''} });
    const { userId, getToken } = useAuth();
    const router = useRouter();

    async function addItem(vals){
        const token = await getToken({ template: "codehooks" });
        const newPantryItem = await addPantry(token, vals);
        console.log(vals);
        router.push('/');

    }

    return(<>
        <Box maw={640} mx="auto">
            <h1>Enter product info</h1>
            <form onSubmit={form.onSubmit((values) => addItem(values))}>
                <TextInput withAsterisk label="Name" placeholder="Name" {...form.getInputProps('name')} />
                <TextInput withAsterisk label="Group" placeholder="Group" {...form.getInputProps('group')} />
                <TextInput label="Quantity" placeholder="Quantity" {...form.getInputProps('quantity')} />
                <DateInput label="Expiration Date" placeholder="Expires on" valueFormat="YYYY-MM-DD" {...form.getInputProps('expiration')} />
                <Group position="center" mt="md">
                    <Button type="submit">Add product</Button>
                </Group>
            </form> 
        </Box>
    </>);
}