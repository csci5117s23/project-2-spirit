import PageContainer from "@/components/page/PageContainer";
import {Button, Container, Badge, TextInput, Box, List} from "@mantine/core";
import {useEffectWithAuth} from "@/hook/useEffectWithAuth";
import { useInputState } from '@mantine/hooks';
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import { getPantry, updatePantry } from "@/modules/Data";
import { useAuth } from "@clerk/nextjs";

export default function PantryHome(){
    const [pantryItems, setPantryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffectWithAuth(async (authToken) => {
        getPantry(authToken)
            .then((pantry) => {
                setPantryItems(pantry);
                setLoading(false);
                console.log(pantryItems);
            })
    })

    if(loading){
        return(<><span>Loading...</span></>);
    } else{
        return(<><PageContainer>
                <Container>
                    <h1>Your pantry</h1>
                    <Button onClick={() => router.push('/add')}>Add item to pantry</Button>
                    <PantryList items={pantryItems}></PantryList>
                 </Container>
                </PageContainer></>);
    }
    
}

const PantryItem = ({item}) => {
    //TODO: image support, update quantity
    const [quantity, setQuantity] = useInputState(item.quantity);
    const { getToken } = useAuth();

    async function update(){
        const token = await getToken({ template: "codehooks" });
        item.quantity = quantity;
        const updated = await updatePantry(token, item);
    }

    return(<>
    <Container>
        <Box 
            sx={() => ({
                backgroundColor: 'aqua',
            })}>
            <h2>{item.name}</h2>
            <Badge>{item.group}</Badge>
            <TextInput label="Quantity" value={quantity} onChange={setQuantity} />
            <Button onClick={update}>Save</Button>
            <h2>Expires on: {item.expiration}</h2>
        </Box>
    </Container>
    </>);
}

const PantryList = ({items}) => {
    //example based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/@@iterator
    function getCategories(){
        let categoryMap = new Map();
        let categories = [];
        items.map(item => categoryMap.set(item.group, 1));
        const iterator = categoryMap[Symbol.iterator]();
        for(const item of iterator){
            categories.push(item[0])
        }
        console.log(categories);
        return categories;
    }

    const categories = getCategories();

    return(<>
    {categories.map(category => (<>
        <h1>{category}</h1>
        <List listStyleType="none">
            {items.filter(item => item.group == category).map(item => (
               <List.Item>
                <PantryItem item={item}></PantryItem>
               </List.Item> 
               ))}
        </List>
        </>
    ))}
    </>);
}
