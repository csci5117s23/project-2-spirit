/** @jsxImportSource @emotion/react */
import PageContainer from "@/components/page/PageContainer";
import {Button, Container, Badge, TextInput, Card, List, Grid, Image} from "@mantine/core";
import {useEffectWithAuth} from "@/hook/useEffectWithAuth";
import { useInputState } from '@mantine/hooks';
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import { deletePantry, getPantry, updatePantry, getRecipeBook} from "@/modules/Data";
import { useAuth } from "@clerk/nextjs";
import ExpirationComponent from "@/components/ExpirationComponent";

export default function recipeBook(){
    const [recipeItems, setRecipeItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffectWithAuth(async (authToken) => {
        getRecipeBook(authToken)
            .then((recipes) => {
                setRecipeItems(recipes);
                setLoading(false);
                console.log(recipeItems);
            })
    })

    function onChange(newItems){
        setRecipeItems(newItems);
    }

    if(loading){
        return(<><span>Loading...</span></>);
    } else{
        return(<><PageContainer>
                <Container>
                    <h1>Your Recipe Book</h1>
                    {/* Todo: Page for manually adding new recipes*/}
                    {/* <Button onClick={() => router.push('/addRecipe')}>Add a new recipe</Button> */}
                    <RecipeList items={recipeItems} onChange={onChange}></RecipeList>
                 </Container>
                </PageContainer></>);
    }
    
}

const RecipeItem = ({item, onChange}) => {

    return(<>
    <Container>
        <Card>
            <Grid grow>
                <Grid.Col>
                    <h2
                        css={{
                            verticalAlign: 'middle'
                        }}
                    >
                        {item.name}
                    </h2>
                </Grid.Col>
            </Grid>
        </Card>
    </Container>
    </>);
}

const RecipeList = ({items, onChange}) => {
    return(
        <>
            <div>
                <List listStyleType="none" spacing="sm">
                    {items.map(item => (
                    <List.Item key={item._id}>
                        <RecipeItem item={item} onChange={onChange}></RecipeItem>
                    </List.Item> 
                    ))}
                </List>
            </div>
        </>
    );
}
