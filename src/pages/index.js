import {Button, Card, createStyles} from "@mantine/core";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {SignedIn, SignedOut, SignIn, useAuth} from "@clerk/nextjs";
import * as url from "url";

const RedirectToPantry = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/pantry').then()
    }, [])

    return (<></>)
}

const useStyles = createStyles((theme) => ({
    pageContainer: {
        backgroundImage: "url(./food.webp)",
        backgroundRepeat: "repeat",
        width: "100vw",
        height: "100vh"
    },

    loginContent: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "64px"
    },

    info: {
        textAlign: "center"
    }
}))

export default function Home() {

    const {classes} = useStyles()

    return (
        <>
            <SignedIn>
                <RedirectToPantry/>
            </SignedIn>
            <SignedOut>
                <div className={classes.pageContainer}>
                    <div className={classes.loginContent}>
                        <div className={classes.info}>
                            <h1>Welcome to PantryPro</h1>
                            <h2>Please login or create an account to continue.</h2>
                        </div>
                        <SignIn></SignIn>
                    </div>
                </div>
            </SignedOut>
        </>
    )
}
