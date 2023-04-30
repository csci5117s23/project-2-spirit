/** @jsxImportSource @emotion/react */
import {Badge, Card, Divider, List, Text} from "@mantine/core";


export default function RecipeDetails({ ingredientInfo, recipeName, recipeIngredients, recipeSteps, children }) {

    return (
        <Card>
            {ingredientInfo && <Badge>{ingredientInfo.ingredientsInPantry ?? 0}/ {ingredientInfo.totalIngredients ?? 0} Ingredients in Pantry</Badge>}
            <h1>{recipeName ?? "Unknown Recipe"}</h1>
            <Divider />
            <h2>Ingredients</h2>
            {(recipeIngredients && recipeIngredients.length > 0) ?
                (<List>
                    {recipeIngredients.map((ingredient, idx) => (
                        <List.Item key={idx}>{ingredient}</List.Item>
                    ))}
                </List>) : (
                    <Text>No ingredients needed</Text>
                )
            }
            <h2>Steps</h2>
            {(recipeSteps && recipeSteps.length > 0) ?
                (<List>
                    {recipeSteps.map((step, idx) => (
                        <List.Item key={idx} sx={{
                            "& .___ref-itemWrapper": {
                                marginRight: "2em",
                                marginBottom: "1em"
                            }
                        }}>{step}</List.Item>
                    ))}
                </List>) : (
                    <Text>No steps needed</Text>
                )
            }
            {children}
        </Card>
    )
}