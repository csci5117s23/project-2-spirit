import '@/styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs';
import {MantineProvider} from '@mantine/core';
import Head from "next/head";

export default function App({Component, pageProps}) {
    return (
        <>
        <ClerkProvider {...pageProps} >
            <Head>
                <title>PantryPro</title>
                <meta name="description" content="Manage your pantry like a pro!"/>
                <link rel="icon" href="/favicon.ico"/>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            </Head>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    /** Put your mantine theme override here */
                    colorScheme: 'light',
                }}
            >
                <Component {...pageProps} />
            </MantineProvider>
        </ClerkProvider>
        </>
    )
}
