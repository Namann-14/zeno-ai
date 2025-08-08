'use client'
import { Button } from "@workspace/ui/components/button"
import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default function Page() {
  const users = useQuery(api.users.getMany);
  const newUser = useMutation(api.users.add);
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <OrganizationSwitcher hidePersonal/>
          <UserButton />
        </div>
      </div>
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-xl font-semibold">Welcome to your organization dashboard</h2>
          <Button size="sm">Button</Button>
          <Button onClick={() => newUser()}>Add user</Button>
          {users && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Users:</h3>
              <pre className="text-sm">{JSON.stringify(users, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}