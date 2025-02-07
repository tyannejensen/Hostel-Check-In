"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Noop, RefCallBack, useForm } from "react-hook-form";
import "@/styles/global.css";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

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
  //   paymentMethodType: z.string(),
  //   paymentMethod: z
  //     .object({
  //       paymentName: z.string(),
  //       isPrimay: z.boolean(),
  //       method: z.string(),
  //       cardHolderName: z.string(),
  //       cardNumber: z.string(),
  //       expirationDate: z.string(),
  //       cvv: z.string(),
  //       routingNumber: z.string().optional(),
  //       accountNumber: z.string().optional(),
  //       bankName: z.string().optional(),
  //     })
  //     .optional(),
});

interface TenantForm {
  handleOnSubmit: (values: z.infer<typeof formSchema>) => void;
  title?: string;
  defaultValues: any;
}

const TenantForm: React.FC<TenantForm> = ({
  handleOnSubmit,
  title,
  defaultValues,
}) => {
  const [paymentMethodType, setPaymentMethodType] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
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

  //   function handlePaymentMethodSelected(value: string, field: any) {
  //     const paymentMethod = {
  //       paymentName: "",
  //       isPrimay: false,
  //       method: value,
  //       cardHolderName: "",
  //       cardNumber: "",
  //       expirationDate: "",
  //       cvv: "",
  //     };
  //     setPaymentMethodType(value);
  //     console.log(value);
  //     field.onChange(value);
  //     form.setValue("paymentMethod", paymentMethod);
  //     form.setValue("paymentMethodType", value);
  //   }
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <>
      <div className="page">
        <div className="w-[80rem]">
          <h1 className="pt-[10px] pl-[30px] font-bold">{title}</h1>
          <div className=" rounded-xl table-container border bg-card text-card-foreground shadow">
            {/* Form Start */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
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
                          placeholder="123-456-7890"
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
                {/* <hr></hr>
                <h4>Payment Method</h4> */}
                {/* <FormField
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
                /> */}
                {/* Create a conditional form that shows the fields for a credit
                card vs a bank account */}
                {/* {paymentMethodType === "credit" ||
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
                ) : null} */}
                <div className="b-box">
                  <Button
                    className="mt-[20px] submit-button"
                    type="button"
                    onClick={form.handleSubmit(handleOnSubmit)}
                  >
                    Submit
                  </Button>
                  {success && <p className="text-green-500 ml-4">{success}</p>}
                </div>
              </form>
            </Form>

            {/* Form End */}
          </div>
        </div>
      </div>
    </>
  );
};

export default TenantForm;
