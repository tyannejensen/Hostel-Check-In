"use client";

import React from "react";
import { z } from "zod";
import { cn } from "@/client-utils/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { Noop, RefCallBack, useForm } from "react-hook-form";
import "@/styles/global.css";
import { Button } from "@/components/ui/button";
import { saveNote } from "@/actions/note.actions";
import { useRouter, useParams } from "next/navigation";


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";


const formSchema = z.object({
    content: z.string(),

});

export default function Page() {
    const router = useRouter();
    const { id } = useParams();

    console.log("User ID:", id);

    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
        },
    });

    async function handleFormSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        // Save the note to the database
        const response = await saveNote({
            newNote: values.content,
            userId: id as string, // Pass the user ID from the URL parameters
        });
        console.log("Save note response:", response);
        if (response.error) {
            setError(response.message);
            setSuccess("");
        } else {
            setError("");
            setSuccess("Note Created Successfully");
            form.reset();
            // Handle successful note creation (e.g., redirect to tenant {id})
        }
    }


    return (
        <>
            <div className="page">
                <div className="w-[80rem]">
                    <h1 className="pt-[10px] pl-[30px] font-bold">Add Note</h1>
                    <div className=" rounded-xl table-container border bg-card text-card-foreground shadow">
                        {/* Form Start */}
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleFormSubmit)}
                                className="space-y-8"
                            >
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="b-box">
                                            <div className="label-title whitespace-nowrap">
                                                New Note
                                            </div>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="b-box">
                                    <Button
                                        className="mt-[20px] submit-button"
                                        type="submit"
                                    >
                                        Submit
                                    </Button>
                                    {success && <p className="text-green-500 ml-4">{success}</p>}
                                    {error && <p className="text-red-500 ml-4">{error}</p>}
                                </div>
                                {/* Form End */}
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
