import PageContainer from "@/components/page/PageContainer";
import {getCategories} from "@/modules/Wizard";
import {useEffectWithAuth} from "@/hook/useCodeHooks";


export default function WizardHome() {

    useEffectWithAuth(async (authToken) => {
        getCategories(authToken)
            .then()
    })

    return (<PageContainer>Test</PageContainer>)
}