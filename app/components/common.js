export function Spinner({ color, height, width }) {
    return <svg className="animate-spin" style={{
        height: height || "90%",
    }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke={color || "currentColor"} strokeWidth="2" strokeDasharray="15" strokeLinecap="round" fill="none" />
    </svg>
}

export const apiEndPoint = "http://localhost:1000"

async function POST(slug, options) {
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

    response = await response.json()
    return response
}

export const server = {
    apiEndPoint,
    POST
}