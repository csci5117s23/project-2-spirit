const darkMode = (theme) => theme.colorScheme === "dark";

export const pantryProTheme = {
    colorScheme: 'light',
    primaryColor: 'brandSecondary',
    defaultRadius: 16,
    colors: {
        brandPrimary: [
            "#fffbff",
            "#fcf8ff",
            "#f2efff",
            "#e1dfff",
            "#c1c1ff",
            "#a1a3fc",
            "#8688e0",
            "#6d6ec4",
            "#5455a9",
            "#47499c"
        ],
        brandSecondary: [
            "#e5f8f8",
            "#cde2e1",
            "#b1cecc",
            "#94bab7",
            "#77a5a2",
            "#5d8b89",
            "#476d6b",
            "#314e4c",
            "#1b302e",
            "#00120f",
        ],
        brandTertiary: [
            "#fffbff",
            "#fff8f2",
            "#ffefd3",
            "#ffdf9b",
            "#f1c048",
            "#d3a52e",
            "#b58a0e",
            "#967100",
            "#785a00",
            "#694e00"
        ],
    },
    components: {
        h1: {
            styles: (theme, params, {variant}) => ({
                root: {
                    color: "blue"
                },
            }),
        },

        Button: {
            styles: (theme, params, {variant}) => ({
                root: {
                    color: params.color ? "inherit" : theme.colors["brandPrimary"][9],
                    backgroundColor: params.color ? "inherit" : theme.colors["brandSecondary"][1],
                    '&:hover,:focus,:active': {
                        backgroundColor: params.color ? "inherit" : theme.colors["brandSecondary"][0]
                    },
                    border: `1px solid ${theme.colors["brandSecondary"][2]}`
                },
            }),
        },

        Paper: {
            styles: (theme, params, {variant}) => ({
                root: {
                    border: `1px solid ${theme.colors.gray[darkMode(theme) ? 9 : 3]}`
                }
            })
        }
    },

    globalStyles: (theme) => ({
        "h1": {
            color: theme.colors["brandPrimary"][darkMode(theme) ? 4 : 9]
        },
        "h2": {
            color: theme.colors["brandPrimary"][darkMode(theme) ? 6 : 8]
        },
        "h3": {
            color: theme.colors["brandPrimary"][darkMode(theme) ? 6 : 7]
        },
        ".mantine-AppShell-main": {
            background: "url(./food.webp)"
        }
    })
}