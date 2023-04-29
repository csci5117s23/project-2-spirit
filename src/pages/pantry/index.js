/** @jsxImportSource @emotion/react */
import PageContainer from "@/components/page/PageContainer";
import {Button, Container, Badge, TextInput, Card, List, Grid, Image, Loader, Center} from "@mantine/core";
import {useEffectWithAuth} from "@/hook/useEffectWithAuth";
import {useInputState} from '@mantine/hooks';
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {deletePantry, getPantry, updatePantry} from "@/modules/Data";
import {useAuth} from "@clerk/nextjs";
import ExpirationComponent from "@/components/ExpirationComponent";
import {IconCross, IconPencil, IconPlus, IconTemperatureMinus, IconTrashFilled} from "@tabler/icons-react";


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
                    <h1>Your Pantry</h1>
                    <Center>
                        <Button leftIcon={<IconPlus/>} color="green" size="xl" onClick={() => router.push('/add')}>New
                            Item</Button>
                    </Center>
                    <PantryList items={pantryItems} onChange={onChange}></PantryList></>
            ) : <Loader/>}
        </Container>
    </PageContainer></>);

}

const PantryItem = ({item, onChange}) => {
    //TODO: date format, styling
    const DEFAULT_IMAGE = './food.jpg'
    const [quantity, setQuantity] = useInputState(item.quantity);
    const {getToken} = useAuth();
    const router = useRouter();

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
        <Container sx={{
            'button': {
                marginBottom: '10px',
                marginTop: '10px'
            }
        }}>
            <Card>
                <Grid grow columns={25} justify="center" align="center">
                    <Grid.Col span={4}>
                        <Image src={item.image} width={100}></Image>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <h2>{item.name}</h2>
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <h2>{item.quantity}</h2>
                    </Grid.Col>
                    {(item.expiration != null) && (
                        <Grid.Col span={6}>
                            <ExpirationComponent isoTimestamp={item.expiration}/>
                        </Grid.Col>
                    )}
                    
                    <Grid.Col span={5} sx={{
                        "& button": {
                            width: "100%"
                        }
                    }}>
                        <Button leftIcon={<IconPencil/>} onClick={() => router.push('/pantry/' + item._id)}
                                color="yellow">Edit Item</Button>
                        <Button leftIcon={<IconTrashFilled/>} onClick={deleteItem} variant="outlined" color="red">Delete
                            item</Button>
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
                        <List.Item key={item._id} sx={{
                            "& .___ref-itemWrapper": {
                                width: "100%"
                            }
                        }}>
                            <PantryItem item={item} onChange={onChange}></PantryItem>
                        </List.Item>
                    ))}
                </List>
            </div>
        ))}
    </>);
}
