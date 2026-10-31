"use client"
import Image from "next/image"
import { FormEvent } from "react"

export interface SignupPageProps {
    prop: string
}

export default function SignupPage({ prop }: SignupPageProps) {
    const handleSignup = ({e}:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData)
        console.log(data)
    }
    return <>
    <div className="flex w-full justify-center mx-auto items-center my-20 container">
        <div className="w-full mx-auto text-center p-10 bg-green-50">
            <h1 className="text-green-800 text-4xl font-extrabold">Welcome to Sign up</h1>
            {/* form */}
            <form onSubmit={handleSignup} className="flex flex-col items-start bg-green-500/50 rounded-2xl p-6">
                {/* profile pic */}
                <input type="file" name="image" placeholder="set your profile pic" className="bg-green-50 h-40 w-40 rounded-full text-center mx-auto"/>
                {/* name */}
                <label htmlFor="name" className="mt-4">Your Name</label>
                <input type="text" name="name" placeholder="Write hare you full name" className="bg-green-50 w-full p-2"/>
                {/* email */}
                <label htmlFor="email" className="mt-4">Your Email</label>
                <input type="email" name="email" placeholder="exp: john@example.com" className="bg-green-50 w-full p-2"/>
                
                {/* password */}
                <label htmlFor="password" className="mt-4">Create a password</label>
                <input type="password" name="password" placeholder="type your password" className="bg-green-50 w-full p-2"/>
                {/* re-type password */}
                <label htmlFor="confirm_password" className="mt-4">confirm your password</label>
                <input type="password" name="confirm_password" placeholder="re-type your password"  className="bg-green-50 w-full p-2"/>
                <button type="submit" className="bg-green-800 text-green-50 px-6 py-2 w-2/3 mx-auto mt-10 rounded-lg text-center ">Sing up</button>
            </form>

        </div>
        <div className="w-full">
            <Image src={"/signup_img/signup.png"} alt="sign up img" width={600} height={600}/>
        </div>
    </div>
    </>
}