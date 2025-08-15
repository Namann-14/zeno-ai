'use client'

import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@workspace/ui/components/form";
import { api } from "@workspace/backend/_generated/api"
import { Id } from "@workspace/backend/_generated/dataModel"
import { Button } from "@workspace/ui/components/button"
import { useMutation, useQuery } from "convex/react"
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react"
import { AIConversation, AIConversationContent, AIConversationScrollButton } from "@workspace/ui/components/ai/conversation"
import {
    AIInput,
    AIInputButton,
    AIInputSubmit,
    AIInputTextarea,
    AIInputToolbar,
    AIInputTools
} from "@workspace/ui/components/ai/input"
import { AIMessage, AIMessageContent } from "@workspace/ui/components/ai/message"
import { AIResponse } from "@workspace/ui/components/ai/response"
import { AISuggestion, AISuggestions } from "@workspace/ui/components/ai/suggestion"
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";

const formSchema = z.object({
    message: z.string().min(1, "Message is required"),
});

export const ConversationIdView = ({
    conversationId,
}: { conversationId: Id<"conversations"> }) => {

    const conversation = useQuery(api.private.conversations.getOne, {
        conversationId,
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: ""
        },
    });

    const messages = useThreadMessages(
        api.private.messages.getMany,
        conversation?.threadId ? { threadId: conversation.threadId } : "skip",
        { initialNumItems: 10 }
    );

    const createMessage = useMutation(api.private.messages.create);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await createMessage({
                conversationId,
                prompt: values.message
            });

            form.reset();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex h-full flex-col bg-muted">
            <header className="flex items-center justify-between border-b bg-background p-2.5">
                <Button
                    size="sm"
                    variant="ghost"
                >
                    <MoreHorizontalIcon />
                </Button>
            </header>
            <div className="flex flex-1 flex-col min-h-0">
                <AIConversation className="flex-1 overflow-y-auto rounded-2xl">
                    <AIConversationContent className="h-full">
                        {/* <InfiniteScrollTrigger
                            canLoadMore={canLoadMore}
                            isLoadingMore={isLoadingMore}
                            onLoadMore={handleLoadMore}
                            ref={topElementRef}
                        /> */}
                        {toUIMessages(messages.results ?? [])?.map((message) => {
                            return (
                                <AIMessage
                                    from={message.role === "user" ? "assistant" : "user"}
                                    key={message.id}
                                >
                                    <AIMessageContent>
                                        <AIResponse>{message.content}</AIResponse>
                                    </AIMessageContent>
                                    {message.role === "user" && (
                                        <DicebearAvatar
                                            imageUrl="/logo2.svg"
                                            seed={conversation?.contactSessionId ?? ""}
                                            size={32}
                                        />
                                    )}
                                </AIMessage>
                            )
                        })}
                    </AIConversationContent>
                    <AIConversationScrollButton />
                </AIConversation>
                <div className="border-t bg-background p-2 sticky bottom-0">
                    <Form {...form}>
                        <AIInput
                            className="w-full"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                control={form.control}
                                disabled={conversation?.status === "resolved"}
                                name="message"
                                render={({ field }) => {
                                    return (
                                        <AIInputTextarea
                                            disabled={conversation?.status === "resolved" || form.formState.isSubmitting}
                                            onChange={field.onChange}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    form.handleSubmit(onSubmit)();
                                                }
                                            }}
                                            placeholder={
                                                conversation?.status === "resolved"
                                                    ? "This conversation has been resolved"
                                                    : "Type your response as an operator..."
                                            }
                                            value={field.value}
                                            className="min-h-[80px]"
                                        >
                                            <AIInputToolbar className="flex items-center justify-between p-2 border-t">
                                                <AIInputTools />
                                                <div className="flex items-center gap-2">
                                                    <AIInputButton variant="ghost" size="sm">
                                                        <Wand2Icon className="h-4 w-4" />
                                                        Enhance
                                                    </AIInputButton>
                                                    <AIInputSubmit
                                                        disabled={conversation?.status === "resolved" || !form.formState.isValid || form.formState.isSubmitting}
                                                        status="ready"
                                                        type="submit"
                                                    />
                                                </div>
                                            </AIInputToolbar>
                                        </AIInputTextarea>
                                    );
                                }}
                            />
                        </AIInput>
                    </Form>
                </div>
            </div>
        </div>
    )
}
