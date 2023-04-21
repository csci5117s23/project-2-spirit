/** @jsxImportSource @emotion/react */
import {useRouter} from "next/router";
import {useState} from "react";
import {useEffectWithAuth} from "@/hook/useEffectWithAuth";
import {getRecipes} from "@/modules/Wizard";
import {Alert, Badge, Button, Card, Center, Container, Divider, List, Loader, Text} from "@mantine/core";
import {IconAlertCircle} from "@tabler/icons-react";
import PageContainer from "@/components/page/PageContainer";

// import added for saving new recipes
import { addRecipeToBook } from "@/modules/Data";
import { useAuth } from "@clerk/nextjs";

const WrapWithPage = (props) => {
    return (
        <PageContainer>
            <Container>
                {props.children}
            </Container>
        </PageContainer>
    )
}

export default function WizardRecipeView() {
    const router = useRouter();
    const {recipe} = router.query
    const [wizardResponse, setResponse] = useState(null)

    // const added for saving new recipes
    const { getToken } = useAuth();

    async function addNewRecipe(recipe){
        const token = await getToken({ template: "codehooks" });
        await addRecipeToBook(token, recipe);
    }

    useEffectWithAuth(async (authToken) => {
        getRecipes(authToken, recipe)
            .then((wizardResponse) => {
                console.log("Wizard response is ", wizardResponse)
                setResponse(wizardResponse)
            })
    })

    if (wizardResponse) {
        console.log("Wizard response is ", wizardResponse)
        const response = wizardResponse.response
        if (response.error) {
            const context = response.context ? `Wizard provided the following context: ${response.context}` : response.error
            const title = response.context ? response.error : "Unable to retrieve recipes"

            return (<WrapWithPage><WizardRecipeError error={title} context={context}/></WrapWithPage>)
        } else if (!response.recipes || response.recipes.length < 1) {
            return (<WrapWithPage><WizardRecipeError error={`No Recipes Found`}
                                       context={`Wizard did not come up with any recipes for that prompt with your given pantry ingredients. Please try again.`}/></WrapWithPage>)
        } else {
            return (<WrapWithPage>{response.recipes.map((recipe, idx) => (
                <Card key={idx}>
                    <Badge>{recipe.ingredientsInPantry ?? 0}/ {recipe.totalIngredients ?? 0} Ingredients in Pantry</Badge>
                    <h1>{recipe.name ?? "Unknown Recipe"}</h1>
                    <Divider />
                    <h2>Ingredients</h2>
                    {(recipe.ingredients && recipe.ingredients.length > 0) ?
                        (<List>
                                {recipe.ingredients.map((ingredient, idx) => (
                                    <List.Item key={idx}>{ingredient}</List.Item>
                                ))}
                        </List>) : (
                            <Text>No ingredients needed</Text>
                        )
                    }
                    <h2>Steps</h2>
                    {(recipe.steps && recipe.ingredients.length > 0) ?
                        (<List>
                            {recipe.steps.map((step, idx) => (
                                <List.Item key={idx}>{step}</List.Item>
                            ))}
                        </List>) : (
                            <Text>No steps needed</Text>
                        )
                    }
                    <Button
                        css={{
                            marginTop: '1em'
                        }}
                        onClick={() => addNewRecipe(recipe)}
                    >
                        Save this Recipe
                    </Button>
                </Card>

            ))}</WrapWithPage>)
        }
    } else {
        return (
            <WrapWithPage>
                    <Text fz={`xl`} fw={600}>Great ideas await!</Text>
                    <Text>Please wait while we generate some recipe ideas. This may take a while depending on current
                        OpenAI
                        system load.</Text>
                    <br />
                    <Center><Loader /></Center>
            </WrapWithPage>
        )
    }
}

const WizardRecipeError = ({error, context}) => {
    return (<Alert icon={<IconAlertCircle size="1rem"/>} title={error} color={`red`}>
        {context}
    </Alert>)
}