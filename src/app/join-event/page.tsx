"use client"
import { AuthContext } from "@/context/AuthProvider"
import { useContext } from "react"

export default function JoinEventPage({children}) {
    const {joined} = useContext(AuthContext)
    console.log(joined);
    return <>
    <h1 className="text-black">Joined events page</h1>
    </>
}