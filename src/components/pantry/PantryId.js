import { Card, TextInput, Image, Button, Badge } from "@mantine/core";
import {useInputState} from '@mantine/hooks';
import { updatePantry, deletePantry } from "@/modules/Data";
import { useState, useEffect } from "react";
import {useAuth} from "@clerk/nextjs";
import { useRouter } from "next/router";
import { DateInput } from "@mantine/dates";

export default function PantryId({item}){
    const DEFAULT_IMAGE = './food.jpg'
    const [quantity, setQuantity] = useInputState(item.quantity);
    const [expiration, setExpiration] = useState(null);
    const {getToken} = useAuth();
    const router = useRouter();


    useEffect(() => {
        if(item.image == null){
            item.image = DEFAULT_IMAGE;
        }
        if(item.expiration != null){
            setExpiration(new Date(item.expiration));
        }
    }, []);

    async function update() {
        const token = await getToken({template: "codehooks"});
        item.quantity = quantity;
        item.expiration = expiration;
        const updated = await updatePantry(token, item);
    }

    async function deleteItem() {
        const token = await getToken({template: "codehooks"});
        const deleted = await deletePantry(token, item);
        router.push('/pantry');
    }

    

  
    return(<><Card>
                <Image src={item.image} width={200}/>
                <h1>{item.name}</h1>
                <Badge>{item.group}</Badge>
                <TextInput label="Quantity" value={quantity} onChange={setQuantity} />
                <DateInput label="Expiration" value={expiration} valueFormat="YYYY-MM-DD" onChange={setExpiration} /><br />
                <Button onClick={update}>Save</Button>
             </Card></>)
}