/**
 * The PageContainer component contains the header, navigation,
 * and base functionality for the PantryPro application.
 *
 *
 * @param props Props to pass to the container.
 */
import {IconArticle, IconFridge, IconPlus, IconWand} from "@tabler/icons-react";
import {useRouter} from "next/router";
import PantryAppShell from "@/components/page/PantryAppShell";
import {RedirectToSignIn, SignedIn, SignedOut} from "@clerk/nextjs";

const navLinks = [
    {link: '/pantry', label: "Your Pantry", icon: IconFridge},
    {link: '/add', label: "Add Item", icon: IconPlus},
    {link: '/wizard', label: "Recipe Wizard", icon: IconWand},
    {link: '/recipes', label: "Your Recipes", icon: IconArticle},
]
export default function PageContainer(props) {

    const router = useRouter();
    const active = navLinks.find(l => l.link === router.pathname)

    return (
        <>
            <SignedIn>
                <PantryAppShell links={navLinks} activeRoute={active}>
                    {props.children}
                </PantryAppShell>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    )
}