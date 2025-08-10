import { SignUp } from "@clerk/nextjs";

export default function SignUpView() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <SignUp routing="hash" />
        </div>
    )
}