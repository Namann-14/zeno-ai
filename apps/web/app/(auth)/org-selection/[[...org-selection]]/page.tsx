import { OrganizationSelectView } from "@/modules/auth/ui/views/organization-select-view";

export default function Page() {
    return (
        <div>
            <div className="mb-4 p-4 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                    You need to select or create an organization to continue.
                </p>
            </div>
            <OrganizationSelectView />
        </div>
    )
}