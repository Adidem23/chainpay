"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "./ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"

import React from 'react'

const formSchema = z.object({
    ethAddress: z.string().min(38, {
        message: "Please enter a valid Ethereum address",
    }),
})

const InputFormEthAddress = ({
    setValue,
}: {
    setValue: React.Dispatch<React.SetStateAction<string>>
}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ethAddress: "",
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {
        setValue(values.ethAddress)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="ethAddress"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Receiver EthAddress</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default InputFormEthAddress
