export const APP_NAME = 'AblyMonitor'
export const APP_DESC = 'A real time error reporting dashboard on Ably'

export const ABLY_KEY = process.env.NEXT_PUBLIC_ABLY_KEY
export const ABLY_CHANNEL = process.env.NEXT_PUBLIC_ABLY_CHANNEL

export const PRIMARY_COLOR = '#44B78B'

// Default limits, some vary by Ably SDK.
export const HISTORY_LIMIT = 1000
export const HISTORY_HOURS = 24 

export const GITHUB_REPO = "https://github.com/cbonoz/ably23"
