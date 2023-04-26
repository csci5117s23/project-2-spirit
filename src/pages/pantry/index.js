/** @jsxImportSource @emotion/react */
import PageContainer from "@/components/page/PageContainer";
import {Button, Container, Badge, TextInput, Card, List, Grid, Image, Loader} from "@mantine/core";
import {useEffectWithAuth} from "@/hook/useEffectWithAuth";
import {useInputState} from '@mantine/hooks';
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {deletePantry, getPantry, updatePantry} from "@/modules/Data";
import {useAuth} from "@clerk/nextjs";
import ExpirationComponent from "@/components/ExpirationComponent";

export default function PantryHome() {
    const [pantryItems, setPantryItems] = useState([]);
    const router = useRouter();

    useEffectWithAuth(async (authToken) => {
        getPantry(authToken)
            .then((pantry) => {
                setPantryItems(pantry);
                console.log(pantryItems);
            })
    })

    function onChange(newItems) {
        setPantryItems(newItems);
    }

    return (<><PageContainer>
        <Container>
            {pantryItems ? (<>
                    <h1>Your pantry</h1>
                <Button onClick={() => router.push('/add')}>Add item to pantry</Button>
                <PantryList items={pantryItems} onChange={onChange}></PantryList></>
            ) : <Loader />}
        </Container>
    </PageContainer></>);

}

const PantryItem = ({item, onChange}) => {
    //TODO: date format, styling
    const DEFAULT_IMAGE = './food.jpg'
    const [quantity, setQuantity] = useInputState(item.quantity);
    const {getToken} = useAuth();

    async function update() {
        const token = await getToken({template: "codehooks"});
        item.quantity = quantity;
        const updated = await updatePantry(token, item);
    }

    async function deleteItem() {
        const token = await getToken({template: "codehooks"});
        const deleted = await deletePantry(token, item);
        const newList = await getPantry(token);
        onChange(newList);
    }

    if (item.image == null) {
        item.image = DEFAULT_IMAGE;
    }
    return (<>
        <Container>
            <Card>
                <Image src={item.image} width={200}></Image>
                <Grid grow>
                    <Grid.Col>
                        <h2
                            css={{
                                marginBottom: '0em'
                            }}
                        >
                            {item.name}
                        </h2>
                        <Badge>{item.group}</Badge>
                    </Grid.Col>
                    <Grid.Col>
                        <TextInput label="Quantity" value={quantity} onChange={setQuantity}/>
                        <Button
                            css={{
                                marginTop: '1em'
                            }}
                            onClick={update}
                        >
                            Save
                        </Button>
                    </Grid.Col>
                    <Grid.Col>
                        <ExpirationComponent isoTimestamp={item.expiration}/>
                    </Grid.Col>
                    <Grid.Col>
                        <Button onClick={deleteItem}>Delete item</Button>
                    </Grid.Col>
                </Grid>
            </Card>
        </Container>
    </>);
}

const PantryList = ({items, onChange}) => {
    //example based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/@@iterator
    function getCategories() {
        let categoryMap = new Map();
        let categories = [];
        items.map(item => categoryMap.set(item.group, 1));
        const iterator = categoryMap[Symbol.iterator]();
        for (const item of iterator) {
            categories.push(item[0])
        }
        console.log(categories);
        return categories;
    }

    const categories = getCategories();

    return (<>
        {categories.map(category => (<div key={category}>
                <h1>{category}</h1>
                <List listStyleType="none" spacing="sm">
                    {items.filter(item => item.group == category).map(item => (
                        <List.Item key={item._id}>
                            <PantryItem item={item} onChange={onChange}></PantryItem>
                        </List.Item>
                    ))}
                </List>
            </div>
        ))}
    </>);
}
