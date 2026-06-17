const normalizeUid = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const buildCometChatUid = (user) => {
  if (user?.id) {
    return `emr-user-${user.id}`
  }

  const normalized = normalizeUid(user?.username)
  return normalized || `emr-user-${Date.now()}`
}

const getCometChatConfig = () => {
  const appId = process.env.COMETCHAT_APP_ID || ''
  const region = process.env.COMETCHAT_REGION || ''
  const apiKey = process.env.COMETCHAT_API_KEY || process.env.COMETCHAT_AUTH_KEY || ''

  if (!appId || !region || !apiKey) {
    throw new Error(
      'Missing COMETCHAT_APP_ID, COMETCHAT_REGION, or COMETCHAT_API_KEY in server environment.'
    )
  }

  return { appId, region, apiKey }
}

const isDuplicateUserError = (payload) => {
  const message = String(payload?.message || payload?.error || '').toLowerCase()
  const code = String(payload?.code || '').toLowerCase()

  return (
    message.includes('already') ||
    message.includes('exists') ||
    code.includes('already') ||
    code.includes('exists')
  )
}

export const ensureCometChatUser = async ({ uid, name }) => {
  const { appId, region, apiKey } = getCometChatConfig()

  const response = await fetch(`https://api-${region}.cometchat.io/v3/users`, {
    method: 'POST',
    headers: {
      appid: appId,
      apikey: apiKey,
      'content-type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify({ uid, name })
  })

  if (response.ok) {
    return { uid, name }
  }

  const payload = await response.json().catch(() => ({}))

  if (response.status === 409 || isDuplicateUserError(payload)) {
    return { uid, name }
  }

  throw new Error(
    payload?.message ||
      payload?.error ||
      `CometChat create user failed with status ${response.status}`
  )
}
