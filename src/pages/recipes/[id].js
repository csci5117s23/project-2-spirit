import { useRouter } from "next/router";
import { useState } from "react";
import { useEffectWithAuth } from "@/hook/useEffectWithAuth";
import { getRecipeById } from "@/modules/Data";
import { Container, Loader } from "@mantine/core";
import PageContainer from "@/components/page/PageContainer";
import RecipeDetails from "@/components/recipe/RecipeDetails";

export default function Id(){
    const [recipeItem, setRecipeItem] = useState(null);
    const router = useRouter();
    const {id} = router.query;

    useEffectWithAuth(async (authToken) => {
        getRecipeById(authToken, id)
            .then((recipeItem) => {
                setRecipeItem(recipeItem);
                console.log(recipeItem);
            })
    })

    if(recipeItem == 403){
        return(<><span>Not allowed to access this item</span></>)
    }

    return(<><PageContainer>
                <Container>
                    {recipeItem ? <RecipeDetails
                                        key={id}
                                        recipeIngredients={recipeItem.ingredients}
                                        recipeSteps={recipeItem.steps}
                                        recipeName={recipeItem.name}
                                    ></RecipeDetails> : <Loader/>}
                </Container>
            </PageContainer></>);
}