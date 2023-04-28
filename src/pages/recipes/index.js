/** @jsxImportSource @emotion/react */
import PageContainer from "@/components/page/PageContainer";
import { Button, Container, Card, List, Grid } from "@mantine/core";
import { useEffectWithAuth } from "@/hook/useEffectWithAuth";
import { useState } from "react";
import { useRouter } from "next/router";
import { getRecipeBook, deleteRecipe } from "@/modules/Data";
import { useAuth } from "@clerk/nextjs";
import { IconTrashFilled } from "@tabler/icons-react";


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
    const {getToken} = useAuth();
    const router = useRouter();

    async function deleteItem() {
        const token = await getToken({template: "codehooks"});
        await deleteRecipe(token, item);
        const newList = await getRecipeBook(token);
        onChange(newList);
    }

    return(<>
    <Container sx={{
        'button': {
            marginBottom: '10px',
            marginTop: '10px'
        }
    }}>
        <Card>
            <Grid grow columns={20} justify="center" align="center">
                <Grid.Col span={10} onClick={() => router.push('/recipes/' + item._id)} sx={{
                    "& h2": {
                        cursor: "pointer"
                    }
                }}>
                    <h2>{item.name}</h2>
                </Grid.Col>
                <Grid.Col span={5} sx={{
                    "& h3": {
                        whiteSpace: "nowrap"
                    }
                }}>
                    <h3>Ingredients: {item.ingredients.length}</h3>
                    <h3>Steps: {item.steps.length}</h3>
                </Grid.Col>
                <Grid.Col span={5} sx={{
                    "& button": {
                        width: "100%"
                    }
                }}>
                    <Button leftIcon={<IconTrashFilled/>} onClick={deleteItem} variant="outlined" color="red">Delete Recipe</Button>
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
                    <List.Item key={item._id} sx={{
                        "& .___ref-itemWrapper": {
                            width: "100%"
                        }
                    }}>
                        <RecipeItem item={item} onChange={onChange}></RecipeItem>
                    </List.Item> 
                    ))}
                </List>
            </div>
        </>
    );
}
