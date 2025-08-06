'use client'
import { Button } from "@workspace/ui/components/button"
import { useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"


export default function Page() {
  const user = useQuery(api.users.getMany);
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
        {JSON.stringify(user)}
      </div>
    </div>
  )
}
