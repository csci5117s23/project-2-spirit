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
    useMantineTheme, NavLink, Button, Center,
} from '@mantine/core';
import Link from "next/link";
import {SignedIn, SignedOut, SignInButton, UserButton, UserProfile} from "@clerk/nextjs";

// Source: https://mantine.dev/core/app-shell/

export default function PantryAppShell({ links, activeRoute, children }) {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);

    const items = links.map((link) => (
        <NavLink
            component={Link}
            key={link.link}
            href={link.link}
            label={link.label}
            active={link.link === activeRoute}
            icon={<link.icon/>}
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
                            <UserButton />
                        </SignedIn>
                        <SignedOut>
                            <Button component={SignInButton}>Sign In</Button>
                        </SignedOut>
                        </Center>
                    </Navbar.Section>
                </Navbar>
            }
            footer={
                <Footer height={60} p="md">
                    Copyright 2023 PantryPro.
                </Footer>
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

                        <Text style={{ fontWeight: 800 }}>PantryPro</Text>
                    </div>
                </Header>
            }
        >
            {children}
        </AppShell>
    );
}