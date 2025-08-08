import React from 'react'
const Page = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="text-gray-600">
        If you can see this page, you are authenticated and have an organization.
        If you don&apos;t have an organization, you should have been redirected to the organization selection page.
      </p>
    </div>
  )
}

export default Page