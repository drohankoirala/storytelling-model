export function Spinner({ color, height, width }) {
    return <svg className="animate-spin" style={{
        height: height || "90%",
    }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke={color || "currentColor"} strokeWidth="2" strokeDasharray="15" strokeLinecap="round" fill="none" />
    </svg>
}

export const apiEndPoint = "http://localhost:5555"

async function POST(slug, options, __file = false) {
    let response = await fetch(`${apiEndPoint}${slug}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
    })

    if (!response.ok) {
        return null
    }

    if (__file) {
        return await response.blob()
    }

    response = await response.json()
    return response
}

export const server = {
    apiEndPoint,
    POST
}

export async function sleep(seconds = 1) {
    return new Promise(resolve => setTimeout(resolve, seconds * 500));
}

export const CLIENT_ID = "78658292174-9sq2qq083cg83i70dpfvo7piid5aboob.apps.googleusercontent.com"
export const CLIENT_SECRET = "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"

export const NEXTAUTH_SECRET = "strong-password"
export const JWT_SECRET = "asjdbfasjbflaskdjf"
export const NEXTAUTH_URL = "https://theworldofwagers.com"

export const TSECRET = "lakmflkamtalkam"
export const PRODUCT_CODE = "EPAYTEST"
export const Admins = ["fwr8vuzt7trlis"]