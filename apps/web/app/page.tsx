'use client'
import { Button } from "@workspace/ui/components/button"
import { useQuery, useMutation } from  "convex/react"
import { api } from "@workspace/backend/_generated/api"

export default function Page() {
  const users = useQuery(api.users.getMany);
  const newUser = useMutation(api.users.add);
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
        <Button onClick={() => newUser()}>Add user</Button>
        {JSON.stringify(users)}
      </div>
    </div>
  )
}
