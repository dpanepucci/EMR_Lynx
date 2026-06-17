import { useEffect, useMemo, useState } from 'react'
import {
    CometChatMessageComposer,
    CometChatMessageHeader,
    CometChatMessageList,
    CometChatUIKit,
    UIKitSettingsBuilder,
} from '@cometchat/chat-uikit-react'
import { CometChat } from '@cometchat/chat-sdk-javascript'
import './careTeamChat.css'
import '@cometchat/chat-uikit-react/css-variables.css'

const getEnv = (viteKey, reactKey) =>
    import.meta.env[viteKey] || import.meta.env[reactKey] || ''

const COMETCHAT_CONSTANTS = {
    APP_ID: getEnv('VITE_COMETCHAT_APP_ID', 'REACT_APP_COMETCHAT_APP_ID'),
    REGION: getEnv('VITE_COMETCHAT_REGION', 'REACT_APP_COMETCHAT_REGION'),
    AUTH_KEY: getEnv('VITE_COMETCHAT_AUTH_KEY', 'REACT_APP_COMETCHAT_AUTH_KEY'),
    UID: getEnv('VITE_COMETCHAT_UID', 'REACT_APP_COMETCHAT_UID'),
}

const isPlaceholderValue = (value) => {
    const normalized = String(value || '').trim().toLowerCase()
    return (
        !normalized ||
        normalized.startsWith('your_') ||
        normalized.includes('replace')
    )
}

const DEFAULT_CARE_TEAM_MEMBERS = [
    { name: 'Cooper, RN', uid: 'cooper-rn' },
    { name: 'Fynn, MD', uid: 'fynn-md' },
    { name: 'Bogey, PCT', uid: 'bogey-pct' },
]

const parseCareTeamMembers = (rawValue) => {
    if (!rawValue) {
        return DEFAULT_CARE_TEAM_MEMBERS
    }

    try {
        const parsed = JSON.parse(rawValue)

        if (!Array.isArray(parsed)) {
            return DEFAULT_CARE_TEAM_MEMBERS
        }

        const cleaned = parsed
            .map((member) => ({
                name: String(member?.name || '').trim(),
                uid: String(member?.uid || '').trim(),
            }))
            .filter((member) => member.name && member.uid)

        return cleaned.length ? cleaned : DEFAULT_CARE_TEAM_MEMBERS
    } catch {
        return DEFAULT_CARE_TEAM_MEMBERS
    }
}

const CARE_TEAM_MEMBERS = parseCareTeamMembers(
    getEnv('VITE_CARE_TEAM_MEMBERS', 'REACT_APP_CARE_TEAM_MEMBERS')
)

const buildUiKitSettings = () =>
    new UIKitSettingsBuilder()
        .setAppId(COMETCHAT_CONSTANTS.APP_ID)
        .setRegion(COMETCHAT_CONSTANTS.REGION)
        .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
        .subscribePresenceForAllUsers()
        .build()

const getCometChatUser = async (uid, name) => {
    try {
        return await CometChat.getUser(uid)
    } catch (error) {
        if (!COMETCHAT_CONSTANTS.AUTH_KEY) {
            throw error
        }

        const user = new CometChat.User(uid)
        user.setName(name)

        try {
            await CometChatUIKit.createUser(user, COMETCHAT_CONSTANTS.AUTH_KEY)
        } catch (createError) {
            const message = String(createError?.message || createError)

            if (!/already exists|duplicate|conflict/i.test(message)) {
                throw createError
            }
        }

        return await CometChat.getUser(uid)
    }
}

const formatCometChatError = (error, fallback) => {
    if (!error) {
        return fallback
    }

    const code = error?.code ? `[${error.code}] ` : ''
    const message = error?.message || String(error)
    return `${fallback} ${code}${message}`.trim()
}

const ensureCurrentUserLoggedIn = async () => {
    const loggedInUser = await CometChatUIKit.getLoggedinUser()

    if (loggedInUser) {
        return loggedInUser
    }

    try {
        return await CometChatUIKit.login(COMETCHAT_CONSTANTS.UID)
    } catch (loginError) {
        if (!COMETCHAT_CONSTANTS.AUTH_KEY) {
            throw loginError
        }

        const currentUser = new CometChat.User(COMETCHAT_CONSTANTS.UID)
        currentUser.setName(COMETCHAT_CONSTANTS.UID)

        try {
            await CometChatUIKit.createUser(currentUser, COMETCHAT_CONSTANTS.AUTH_KEY)
        } catch (createError) {
            const message = String(createError?.message || createError)

            if (!/already exists|duplicate|conflict/i.test(message)) {
                throw createError
            }
        }

        return await CometChatUIKit.login(COMETCHAT_CONSTANTS.UID)
    }
}

function CareTeam () {
    const [selectedUser, setSelectedUser] = useState(undefined)
    const [isReady, setIsReady] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [selectedMemberUid, setSelectedMemberUid] = useState(CARE_TEAM_MEMBERS[0].uid)

    const hasCredentials = useMemo(
        () =>
            Boolean(
                !isPlaceholderValue(COMETCHAT_CONSTANTS.APP_ID) &&
                    !isPlaceholderValue(COMETCHAT_CONSTANTS.REGION) &&
                    !isPlaceholderValue(COMETCHAT_CONSTANTS.AUTH_KEY) &&
                    !isPlaceholderValue(COMETCHAT_CONSTANTS.UID)
            ),
        []
    )
    const handleMemberClick = async (member) => {
        setSelectedMemberUid(member.uid)

        if (!isReady) {
            return
        }

        try {
            const user = await getCometChatUser(member.uid, member.name)
            setSelectedUser(user)
        } catch (error) {
            setErrorMessage(`Unable to open ${member.name} in CometChat.`)
        }
    }


    useEffect(() => {
        let isMounted = true

        if (!hasCredentials) {
            setErrorMessage(
                'Set real values for COMETCHAT env vars in client/.env using either VITE_ or REACT_APP_ prefixes. Placeholder values are not valid.'
            )
            return () => {
                isMounted = false
            }
        }

        const initializeChat = async () => {
            try {
                try {
                    await CometChatUIKit.init(buildUiKitSettings())
                } catch (initError) {
                    const message = String(initError?.message || initError)
                    if (!/already initialized|initialized already|already exists/i.test(message)) {
                        throw initError
                    }
                }

                await ensureCurrentUserLoggedIn()

                if (isMounted) {
                    setIsReady(true)
                    setErrorMessage('')
                }
            } catch (error) {
                if (isMounted) {
                    setErrorMessage(
                        formatCometChatError(
                            error,
                            'CometChat failed to initialize in this environment.'
                        )
                    )
                }
            }
        }

        initializeChat()

        return () => {
            isMounted = false
        }
    }, [hasCredentials])

    useEffect(() => {
        if (!isReady) {
            return
        }

        const activeMember = CARE_TEAM_MEMBERS.find((member) => member.uid === selectedMemberUid) || CARE_TEAM_MEMBERS[0]

        getCometChatUser(activeMember.uid, activeMember.name)
            .then((user) => {
                setSelectedUser(user)
            })
            .catch((error) => {
                setErrorMessage(
                    formatCometChatError(error, `Unable to load ${activeMember.name}.`)
                )
            })
    }, [isReady, selectedMemberUid])

    return (
        <section id='careTeamContainer'>
            <header className='careTeamHeader'>
                <div>
                    <p className='careTeamEyebrow'>Clinical messaging</p>
                    <h3>Care Team Chat</h3>
                </div>
                <p className='careTeamSubtext'>Secure team messaging with live conversation sync.</p>
            </header>

            {!isReady ? (
                <div className='careTeamEmptyState'>
                    <p>{errorMessage || 'Loading CometChat...'}</p>
                </div>
            ) : (
                <div className='careTeamShell'>
                    <aside className='careTeamSidebar'>
                        <div className='careTeamSidebarTitle'>Team Members</div>
                        <p className='careTeamConfigHint'>Configure via VITE_CARE_TEAM_MEMBERS or REACT_APP_CARE_TEAM_MEMBERS.</p>
                        <div className='careTeamButtonList'>
                            {CARE_TEAM_MEMBERS.map((member) => (
                                <button
                                    key={member.uid}
                                    type='button'
                                    className={`chatTeam${selectedMemberUid === member.uid ? ' chatTeamActive' : ''}`}
                                    onClick={() => {
                                        void handleMemberClick(member)
                                    }}
                                >
                                    <span className='chatTeamName'>{member.name}</span>
                                    <span className='chatTeamMeta'>Direct message</span>
                                </button>
                            ))}
                        </div>
                    </aside>

                    <main className='careTeamChatPanel'>
                        {selectedUser ? (
                            <>
                                <CometChatMessageHeader user={selectedUser} />
                                <CometChatMessageList user={selectedUser} />
                                <CometChatMessageComposer user={selectedUser} />
                            </>
                        ) : (
                            <div className='careTeamEmptyState careTeamEmptyStateInline'>
                                <p>Select a care team member to start chatting.</p>
                            </div>
                        )}
                    </main>
                </div>
            )}
        </section>
    )
}

export default CareTeam