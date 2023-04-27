import { useRouter } from "next/router";
import { useState } from "react";
import { useEffectWithAuth } from "@/hook/useEffectWithAuth";
import { getPantryById } from "@/modules/Data";
import { Container, Loader } from "@mantine/core";
import PageContainer from "@/components/page/PageContainer";
import PantryId from "@/components/pantry/PantryId";

export default function Id(){
    const [pantryItem, setPantryItem] = useState(null);
    const router = useRouter();
    const {id} = router.query;

    useEffectWithAuth(async (authToken) => {
        getPantryById(authToken, id)
            .then((pantryItem) => {
                setPantryItem(pantryItem);
                console.log(pantryItem);
            })
    })

    if(pantryItem == 403){
        return(<><span>Not allowed to access this item</span></>)
    }

    return(<><PageContainer>
                <Container>
                    {pantryItem ? <PantryId item={pantryItem} />: <Loader/>}
                </Container>
            </PageContainer></>);
}