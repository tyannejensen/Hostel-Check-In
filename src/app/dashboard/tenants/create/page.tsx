"use client";

import React from "react";
import { z } from "zod";
import { cn } from "@/client-utils/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { Noop, RefCallBack, useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import "@/styles/global.css";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roomsData } from "@/lib/utils/test-data";
import { on } from "events";
import exp from "constants";
import { set } from "mongoose";

const paymentOptions = [
  { label: "Credit", value: "credit" },
  { label: "Debit", value: "debit" },
  { label: "Bank", value: "bank" },
];

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  paymentMethodType: z.string(),
  paymentMethod: z.object({
    paymentName: z.string(),
    isPrimay: z.boolean(),
    method: z.string(),
    cardHolderName: z.string(),
    cardNumber: z.string(),
    expirationDate: z.date(),
    cvv: z.string(),
  }),
});

export default function Page() {
  const [paymentMethodType, setPaymentMethodType] = React.useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  function handleFormSubmit(form: any) {
    const values = form.getValues();
    console.log(values);
  }

  function handlePaymentMethodSelected(value: string, field: any) {
    const paymentMethod = {
      paymentName: "",
      isPrimay: false,
      method: value,
      cardHolderName: "",
      cardNumber: "",
      expirationDate: "",
      cvv: "",
    };
    setPaymentMethodType(value);
    console.log(value);
    field.onChange(value);
    form.setValue("paymentMethod", paymentMethod);
    form.setValue("paymentMethodType", value);
  }

  return (
    <>
      <div className="page">
        <div className="w-[80rem]">
          <h1 className="pt-[10px] pl-[30px] font-bold">ADD TENANT</h1>
          <div className=" rounded-xl table-container border bg-card text-card-foreground shadow">
            {/* Form Start */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="b-box">
                      <div className="label-title whitespace-nowrap">
                        First Name
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
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="b-box">
                      <div className="label-title whitespace-nowrap">
                        Last Name
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="b-box">
                      <div className="label-title whitespace-nowrap">Email</div>
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
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="b-box">
                      <div className="label-title whitespace-nowrap">Phone</div>
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
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="b-box">
                      <div className="label-title whitespace-nowrap">
                        Address
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
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="b-box">
                      <div className="label-title whitespace-nowrap">City</div>
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
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="b-box">
                      <div className="label-title whitespace-nowrap">State</div>
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
                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem className="b-box">
                      <div className="label-title whitespace-nowrap">Zip</div>
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
                <hr></hr>
                <h4>Payment Method</h4>
                <FormField
                  control={form.control}
                  name="paymentMethodType"
                  render={({ field }) => (
                    <FormItem className="b-box">
                      <div className="label-title whitespace-nowrap">
                        Payment Method Type
                      </div>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            handlePaymentMethodSelected(value, field)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue>
                              {field.value
                                ? paymentOptions.find(
                                    (option) => option.value === field.value
                                  )?.label
                                : "Select Status"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {paymentOptions.map((option) => (
                              <SelectItem
                                className={cn(
                                  "select-option",
                                  field.value === option.value &&
                                    "selected-option"
                                )}
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Create a conditional form that shows the fields for a credit
                card vs a bank account */}
                {paymentMethodType === "credit" ||
                paymentMethodType === "debit" ? (
                  <div>
                    <FormField
                      control={form.control}
                      name="paymentMethod.cardHolderName"
                      render={({ field }) => (
                        <FormItem className="b-box">
                          <div className="label-title whitespace-nowrap">
                            Card Holder Name
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
                    <FormField
                      control={form.control}
                      name="paymentMethod.cardNumber"
                      render={({ field }) => (
                        <FormItem className="b-box">
                          <div className="label-title whitespace-nowrap">
                            Card Number
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
                    <FormField
                      control={form.control}
                      name="paymentMethod.expirationDate"
                      render={({ field }) => (
                        <FormItem className="b-box">
                          <div className="label-title whitespace-nowrap">
                            Expiration Date
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
                    <FormField
                      control={form.control}
                      name="paymentMethod.cvv"
                      render={({ field }) => (
                        <FormItem className="b-box">
                          <div className="label-title whitespace-nowrap">
                            CVV
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
                  </div>
                ) : null}

                {paymentMethodType === "bank" ? (
                  <div>
                    <FormField
                      control={form.control}
                      name="paymentMethod.routingNumber"
                      render={({ field }) => (
                        <FormItem className="b-box">
                          <div className="label-title whitespace-nowrap">
                            Routing Number
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
                    <FormField
                      control={form.control}
                      name="paymentMethod.accountNumber"
                      render={({ field }) => (
                        <FormItem className="b-box">
                          <div className="label-title whitespace-nowrap">
                            Account Number
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
                    <FormField
                      control={form.control}
                      name="paymentMethod.bankName"
                      render={({ field }) => (
                        <FormItem className="b-box">
                          <div className="label-title whitespace-nowrap">
                            Bank Name
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
                  </div>
                ) : null}
                <div className="b-box">
                  <Button
                    className="mt-[20px] submit-button"
                    type="button"
                    onClick={() => handleFormSubmit(form)}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>

            {/* Form End */}
          </div>
        </div>
      </div>
    </>
  );
}
