import {useAuth} from "@clerk/nextjs";
import {useEffect} from "react";

export function useEffectWithAuth(closure) {
    const {isLoaded, userId, getToken} = useAuth();
    useEffect(() => {
        const callback = async () => {
            if (isLoaded && userId != null) {
                const token = await getToken();
                if (token) {
                    await closure(token)
                }
            }
        }
        callback().then()
    }, [isLoaded])
}