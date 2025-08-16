'use client'

import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@workspace/ui/components/form";
import { api } from "@workspace/backend/_generated/api"
import { Id } from "@workspace/backend/_generated/dataModel"
import { Button } from "@workspace/ui/components/button"
import { useAction, useMutation, useQuery } from "convex/react"
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
import { ConversationStatusButton } from "../components/conversation-status-button";
import { useState } from "react";
import { UseInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";

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

    const {
        topElementRef,
        handleLoadMore,
        canLoadMore,
        isLoadingMore
    } = UseInfiniteScroll({
        status: messages.status,
        loadMore: messages.loadMore,
        loadSize: 10
    })

    const [isEnhancing, setIsEnhancing] = useState(false);
    const enhanceResponse = useAction(api.private.messages.enhanceResponse);
    const handleEnhanceResponse = async () => {
        setIsEnhancing(true);
        const currentValue = form.getValues("message");
        try {
            const response = await enhanceResponse({ prompt: currentValue });
            form.setValue("message", response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsEnhancing(false);
        }
    }

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

    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const updateConversationStatus = useMutation(api.private.conversations.updateStatus);
    const handleToggleStatus = async () => {
        if (!conversation) {
            return;
        }
        setIsUpdatingStatus(true);

        let newStatus: "unresolved" | "resolved" | "escalated";

        if (conversation.status === "unresolved") {
            newStatus = "escalated"
        } else if (conversation.status === "escalated") {
            newStatus = "resolved";
        } else {
            newStatus = "unresolved"
        }

        try {
            await updateConversationStatus({
                conversationId,
                status: newStatus
            })
        } catch (error) {
            console.error(error)
        } finally {
            setIsUpdatingStatus(false);
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
                {!!conversation && (
                    <ConversationStatusButton
                        onClick={handleToggleStatus}
                        status={conversation?.status}
                        disabled={isUpdatingStatus}
                    />
                )}
            </header>
            <div className="flex flex-1 flex-col min-h-0">
                <AIConversation className="flex-1 overflow-y-auto rounded-2xl">
                    <AIConversationContent className="h-full">
                        <InfiniteScrollTrigger
                            canLoadMore={canLoadMore}
                            isLoadingMore={isLoadingMore}
                            onLoadMore={handleLoadMore}
                            ref={topElementRef}
                        />
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
                <div className="">
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
                                        <>
                                            <AIInputToolbar className="">
                                                <AIInputTools />
                                                <div className="flex items-center gap-2">
                                                    <AIInputButton
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={
                                                            conversation?.status === "resolved"
                                                        }>
                                                        <Wand2Icon className="h-4 w-4" />
                                                        {isEnhancing ? "Enhancing..." : "Enhance"}
                                                    </AIInputButton>
                                                    <AIInputSubmit
                                                        disabled={conversation?.status === "resolved" || !form.formState.isValid || form.formState.isSubmitting || isEnhancing}
                                                        status="ready"
                                                        type="submit"
                                                    />
                                                </div>
                                            </AIInputToolbar>
                                            <AIInputTextarea
                                                disabled={conversation?.status === "resolved" || form.formState.isSubmitting || isEnhancing}
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
                                                className=""
                                            >
                                            </AIInputTextarea>
                                        </>
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
