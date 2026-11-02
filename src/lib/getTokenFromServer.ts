import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const getTokenFromServer = async () => {
const jwtToken = await auth.api.getToken({
    headers: await headers(),
})
const token = jwtToken?.token;

return token
}