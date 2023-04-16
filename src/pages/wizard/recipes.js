import {useRouter} from "next/router";
import {useState} from "react";
import {useEffectWithAuth} from "@/hook/useEffectWithAuth";
import {getRecipes} from "@/modules/Wizard";
import {Alert, Center, Container, Loader, Text} from "@mantine/core";
import {IconAlertCircle} from "@tabler/icons-react";


export default function WizardRecipeView() {
    const router = useRouter();
    const {recipe} = router.query
    const [wizardResponse, setResponse] = useState(null)

    useEffectWithAuth(async (authToken) => {
        getRecipes(authToken, recipe)
            .then((wizardResponse) => {
                setResponse(wizardResponse)
            })
    })

    if (wizardResponse) {
        console.log("Wizard response is ", wizardResponse)
        const response = wizardResponse.response
        if (response.error) {
            const context = response.context ? `Wizard provided the following context: ${response.context}` : response.error
            const title = response.context ? response.error : "Unable to retrieve recipes"

            return (<WizardRecipeError error={title} context={context}/>)
        } else {
            return (<>{JSON.stringify(response)}</>)
        }
    } else {
        return (
            <Container>
                <Text fz={`xl`} fw={600}>Great ideas await!</Text>
                <Text>Please wait while we generate some recipe ideas. This may take a while depending on current OpenAI
                    system load.</Text>
                <Loader/>
            </Container>
        )
    }

    return (
        <>
            {response ? JSON.stringify(response) : <Loader/>}
        </>
    )
}

const WizardRecipeError = ({error, context}) => {
    return (<Alert icon={<IconAlertCircle size="1rem"/>} title={error} color={`red`}>
        {context}
    </Alert>)
}