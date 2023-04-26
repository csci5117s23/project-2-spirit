import {IconMoodConfuzedFilled, IconMoodEmptyFilled, IconMoodHappyFilled} from "@tabler/icons-react";
import {Card, createStyles, Tooltip} from "@mantine/core";
import {getRelativeTime} from "@/util/dateFormat";

const EXPIRING_SOON_THRESHOLD_DAYS = 3

/**
 * Calculate the expiration status of a given item.
 *
 * @param date The expiration date of an item.
 * @param currentDate The current date/time.
 *
 * @return 'good' | 'expiringSoon' | 'expired'
 */
function calculateExpirationStatus(date, currentDate) {
    if (currentDate > date) {
        return 'expired'
    }
    // date >= currentDate
    const remainingMillis = date.getTime() - currentDate

    // remainingDays
    const remainingDays = Math.floor(remainingMillis / 86_400_000)

    if (remainingDays > EXPIRING_SOON_THRESHOLD_DAYS) return "good"
    else return "expiringSoon"
}

const darkMode = (theme) => theme.colorScheme === "dark"

const useStyles = createStyles((theme) => ({
    goodStyle: {
        color: theme.colors['green'][darkMode(theme) ? 2 : 8]
    },
    expiringStyle: {
        color: theme.colors['yellow'][darkMode(theme) ? 2 : 8]
    },
    expiredStyle: {
        color: theme.colors['red'][darkMode(theme) ? 2 : 8]
    },

    expirationContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    },

    expressionContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.5rem"
    },
    timestampContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: 600
    },
}))

const ExpirationComponent = ({isoTimestamp}) => {
    // thanks OmegaStar team for finally supporting ISO timestamps
    const date = new Date(isoTimestamp)

    const currentDate = new Date()
    const {classes} = useStyles()

    // good | expiringSoon | expired
    const status = calculateExpirationStatus(date, currentDate)

    let emote, emoteClassName, expiresFormat
    switch (status) {
        case "good":
            emote = <IconMoodHappyFilled/>
            emoteClassName = classes.goodStyle
            expiresFormat = "Expires "
            break;
        case "expiringSoon":
            emote = <IconMoodEmptyFilled/>
            emoteClassName = classes.expiringStyle
            expiresFormat = "Expires "
            break;
        default:
            emote = <IconMoodConfuzedFilled/>
            emoteClassName = classes.expiredStyle
            expiresFormat = "Expired "

            break;
    }

    return (
        <>
            <Tooltip label={date.toString()} multiline>
                <Card>
                    <div className={`${emoteClassName} ${classes.expirationContainer}`}>
                        <div className={classes.expressionContainer}>
                            {emote}
                        </div>
                        <div className={classes.timestampContainer}>
                            {`${expiresFormat} ${getRelativeTime(date)}`}
                        </div>
                    </div>
                </Card>
            </Tooltip>
        </>
    )
}

export default ExpirationComponent