/**
 * The PageContainer component contains the header, navigation,
 * and base functionality for the PantryPro application.
 *
 *
 * @param props Props to pass to the container.
 */
import {IconArticle, IconFridge, IconPlus, IconWand} from "@tabler/icons-react";
import {useRouter} from "next/router";
import MainNav from "@/components/page/MainNav";

const navLinks = [
    { link: '/', label: "Your Pantry", icon: IconFridge },
    { link: '/add', label: "Add Item", icon: IconPlus },
    { link: '/wizard', label: "Recipe Wizard", icon: IconWand },
    { link: '/recipes', label: "Your Recipes", icon: IconArticle },
]
export default function PageContainer(props) {

    const router = useRouter();
    const active = navLinks.find(l => l.link === router.pathname)

    return (
        <MainNav links={navLinks} activeRoute={active}>
            {props.children}
        </MainNav>
    )
}