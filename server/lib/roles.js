export const ROLE_CODE_MAP = Object.freeze({
  RN: 'RN-AXIS-2026',
  PCT: 'PCT-AXIS-2026',
  MD: 'MD-AXIS-2026'
})

export const getRoleFromCode = (roleCode) => {
  if (!roleCode) {
    return null
  }

  const normalizedCode = String(roleCode).trim().toUpperCase()

  for (const [role, code] of Object.entries(ROLE_CODE_MAP)) {
    if (normalizedCode === String(code).trim().toUpperCase()) {
      return role
    }
  }

  return null
}

export const getAllowedRoleCodes = () => Object.values(ROLE_CODE_MAP)
