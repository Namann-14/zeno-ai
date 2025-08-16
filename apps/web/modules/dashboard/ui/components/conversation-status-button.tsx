import { Doc } from "@workspace/backend/_generated/dataModel"
import { Button } from "@workspace/ui/components/button";
import { Hint } from "@workspace/ui/components/hint"
import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";
export const ConversationStatusButton = ({ status, onClick, disabled }:
    {
        status: Doc<"conversations">["status"],
        onClick: () => void;
        disabled?: boolean,
    }) => {
    if (status === "resolved") {
        return (
            <Hint text="Mark as unresolved">
                <Button
                    onClick={onClick}
                    size="sm"
                    variant="tertiary"
                    disabled={disabled}
                >
                    <CheckIcon />
                    Resolved
                </Button>
            </Hint>
        )
    }
    if (status === "escalated") {
        return (
            <Hint text="Mark as resolved">
                <Button
                    onClick={onClick}
                    size="sm"
                    variant="warning"
                    disabled={disabled}
                >
                    <ArrowUpIcon />
                    Resolved
                </Button>
            </Hint>
        )
    }
    return (
        <Hint text="Mark as escalated">
            <Button
                onClick={onClick}
                size="sm"
                variant="destructive"
                disabled={disabled}
            >
                <ArrowRightIcon />
                Resolved
            </Button>
        </Hint>
    )

}