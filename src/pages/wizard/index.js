import PageContainer from "@/components/page/PageContainer";
import {getCategories} from "@/modules/Wizard";
import {useEffectWithAuth} from "@/hook/useEffectWithAuth";
import {useEffect, useState} from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Center,
    Container,
    createStyles,
    Divider,
    Grid,
    Loader,
    Text,
    TextInput
} from "@mantine/core";
import {IconAlertCircle, IconExclamationCircle, IconWand} from "@tabler/icons-react";
import {useRouter} from "next/router";


const useStyles = createStyles((theme) => ({
    categoryCard: {
        transition: "all ease-in-out 0.2s",
        [`&:hover,:focus,:active`]: {
            cursor: "pointer",
            transform: "scale(1.01)"
        }
    }
}))
export default function WizardHome() {

    const [response, setResponse] = useState(null)

    useEffectWithAuth(async (authToken) => {
        getCategories(authToken)
            .then((wizardResponse) => {
                setResponse(wizardResponse)
            })
    })

    return (<PageContainer>
        <WizardCategoryRecommendation response={response}/>
        <WizardPrompt/>
    </PageContainer>)
}


const WizardCategoryRecommendation = ({response}) => {
    if (response) {
        if (response.response.error) {
            if (response.response.error === "No ingredients prompt provided.") {
                // User has no ingredients in their pantry
                return (
                    <Center>
                        <Alert icon={<IconWand size="1rem"/>} title="Want personalized recommendations?" color="orange">
                            PantryPro will use the contents of your pantry to suggest recipes tailored to what you have
                            at
                            home.
                            <br/>
                            <br/>
                            However, because you do not have any items added, we can only come up with general recipes.
                        </Alert>
                    </Center>
                )
            } else {
                return (
                    <Center>
                        <Alert icon={<IconExclamationCircle size="1rem"/>} title={response.response.error}
                               color="red">
                            Unable to generate recipe suggestions from your pantry: {response.response.context}
                        </Alert>
                    </Center>
                )
            }
        } else if (response.response && response.response.categories) {
            return (
                <Grid gutter={4}>
                    {response.response.categories
                        .map((category, index) => (
                            <Grid.Col span={4} key={index}>
                                <WizardCategory category={category}/>
                            </Grid.Col>
                        ))}
                </Grid>
            )
        } else {
            return (
                <Center>
                    <Alert icon={<IconExclamationCircle size="1rem"/>} title="Unable to generate suggestions."
                           color="red">
                        An error occurred and we were unable to generate recipe suggestions. You can still enter in a
                        manual
                        prompt below.
                    </Alert>
                </Center>)

        }
    } else {
        return (<Center><Loader/></Center>)
    }
}

const WizardCategory = ({category}) => {
    const router = useRouter()
    const styles = useStyles()

    return (
        <Card withBorder onClick={() => {
            router.push("/wizard/recipes?" + new URLSearchParams({
                recipe: category
            }))
                .then()
        }} className={styles.classes.categoryCard}>
            <Badge>Recommendation</Badge>
            <Text fz="lg" fw={500} mt="md">
                {category}
            </Text>
            <Text fz="sm" c="dimmed" mt={5}>
                Click to generate a recipe based on this suggestion!
            </Text>
        </Card>
    )
}

const WizardPrompt = ({response}) => {
    return (
        <>
            <Divider mt={30} mb={10}/>
            <Container>
                {((response && !response.error) ? <>
                    <Center><Text fz={`xl`} fw={600}>Want something else?</Text> </Center>
                    <Text ta={`center`}>Ask for a recipe below and get an AI suggestion with your pantry in
                        mind!</Text>
                </> : <>
                    <Center><Text fz={`xl`} fw={600}>What do you want to make?</Text> </Center>
                    <Text ta={`center`}>Ask for a recipe below and get some AI suggestions!</Text>
                </>)}
                <WizardSearch/>
            </Container>
        </>
    )
}

const WizardSearch = () => {
    const [input, setInput] = useState("")
    const router = useRouter()

    const handleSearch = () => {
        router.push("/wizard/recipes?" + new URLSearchParams({
            recipe: input
        }))
            .then()
    }
    return (
        <Center mt={10}>
            <TextInput placeholder={`Enter recipe prompt`} onChange={(e) => setInput(e.target.value)} value={input}
                       onKeyDown={(e) => {
                           if (e.key === "Enter") {
                               handleSearch()
                           }
                       }}/>
            <Button onClick={handleSearch}>Search</Button>
        </Center>
    )

}