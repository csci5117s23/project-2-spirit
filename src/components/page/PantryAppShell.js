/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import {
    AppShell,
    Navbar,
    Header,
    Footer,
    Aside,
    Text,
    MediaQuery,
    Burger,
    useMantineTheme, NavLink, Button, Center, createStyles,
} from '@mantine/core';
import Link from "next/link";
import {SignedIn, SignedOut, SignInButton, UserButton, UserProfile} from "@clerk/nextjs";

const appShellStyles = createStyles((theme) => ({
    UserButton: {
        '.cl-userButtonBox': {
            flexDirection: 'row-reverse',
        }
    },

    navLink: {
        svg: {
            color: theme.colors["brandPrimary"][darkMode(theme) ? 1 : 9]
        },
        fontWeight: 600,

        "&:hover,:focus,:active": {
            transform: "scale(1.01)",
            svg: {
                transform: "scale(1.05)"
            }
        },

        transition: "all ease-in-out 0.2s",
    }
}));

// Source: https://mantine.dev/core/app-shell/

const darkMode = (theme) => theme.colorScheme === "dark"

export default function PantryAppShell({ links, activeRoute, children }) {
    const theme = useMantineTheme();
    const { classes } = appShellStyles(theme);
    const [opened, setOpened] = useState(false);

    const items = links.map((link) => (
        <NavLink
            component={Link}
            key={link.link}
            href={link.link}
            label={link.label}
            active={link.link === activeRoute}
            icon={<link.icon/>}
            className={classes.navLink}
        />
    ));

    return (
        <AppShell
            styles={{
                main: {
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={
                <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
                    <Navbar.Section grow>
                        {items}
                    </Navbar.Section>
                    <Navbar.Section>
                        <Center>
                        <SignedIn>
                            <div className={classes.UserButton}>
                                <UserButton showName={true}/>
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <Button component={SignInButton}>Sign In</Button>
                        </SignedOut>
                        </Center>
                    </Navbar.Section>
                </Navbar>
            }
            header={
                <Header height={{ base: 50, md: 70 }} p="md">
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>

                        <img src={`./logo.svg`} alt={`PantryPro`} height={32}/>
                    </div>
                </Header>
            }
        >
            {children}
        </AppShell>
    );
}