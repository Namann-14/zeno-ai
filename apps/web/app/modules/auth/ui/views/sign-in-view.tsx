import { SignIn } from "@clerk/nextjs";

export default function SignInView() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <SignIn routing="hash"/>
        </div>
    )
}