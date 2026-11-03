"use client"

// import { AuthContext } from "@/context/AuthProvider"
import { PlusCircle } from "lucide-react"
// import { useContext } from "react"

export interface JoinBtnProps {
    prop: string
}

export default function JoinBtn(children,event) {
    // const {joined,setJoined} = useContext(AuthContext)
    console.log(event)
    
    return <>
    <button className=" mt-6 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-[#245C45]/30  px-4 py-2 text-sm font-semibold text-[#245C45] transition hover:bg-[#E8F0E8]"> <PlusCircle/> Join Event </button>
    </>
}
//    