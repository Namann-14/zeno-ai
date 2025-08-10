'use client'
import { OrganizationList } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export const OrganizationSelectView = () => {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirectUrl') || '/';
    
    return (
        <OrganizationList
            afterCreateOrganizationUrl={redirectUrl}
            afterSelectOrganizationUrl={redirectUrl}
            hidePersonal
            skipInvitationScreen
        />
    );
}