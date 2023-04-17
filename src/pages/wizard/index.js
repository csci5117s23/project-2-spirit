import PageContainer from "@/components/page/PageContainer";
import {getCategories} from "@/modules/Wizard";
import {useEffectWithAuth} from "@/hook/useEffectWithAuth";
import {useEffect, useState} from "react";
import {Alert, Button, Center, Container, Divider, Loader, Text, TextInput} from "@mantine/core";
import {IconAlertCircle, IconWand} from "@tabler/icons-react";
import {useRouter} from "next/router";


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
        if (response.error) {
            if (response.error === "No ingredients prompt provided.") {
                // User has no ingredients in their pantry
                return (
                    <Alert icon={<IconWand size="1rem"/>} title="Want personalized recommendations?" color="orange">
                        PantryPro will use the contents of your pantry to suggest recipes tailored to what you have at
                        home.
                        <br/>
                        <br/>
                        However, because you do not have any items added, we can only come up with general recipes.
                    </Alert>
                )
            }
        } else {
            return (<>{JSON.stringify(response)}</>)
        }
    } else {
        return (<Loader/>)
    }
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