"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/users.actions";
import OtpModal from "@/components/OTPModal"; // Ensure this path is correct

type FormType = "sign-in" | "sign-up";

// Schema for form validation using Zod
const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email("Invalid email address."),
    fullName:
      formType === "sign-up"
        ? z
            .string()
            .min(2, "Full name must be at least 2 characters.")
            .max(50, "Full name must not exceed 50 characters.")
        : z.string().optional(), // fullName is optional for sign-in
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState<string | null>(null); // accountId is a string when set, otherwise null

  // Initialize react-hook-form with Zod resolver
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "", // Default empty string for fullName
      email: "", // Default empty string for email
    },
  });

  // Function to handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true); // Start loading when form is submitted
    setErrorMessage(""); // Clear any previous error messages

    try {
      // Call appropriate backend action based on form type (sign-in or sign-up)
      const user =
        type === "sign-up"
          ? await createAccount({
              fullName: values.fullName || "", // Ensure fullName is a string for createAccount
              email: values.email,
            })
          : await signInUser({ email: values.email });

      // If a user object with accountId is returned, open the OTP modal
      if (user && user.accountId) {
        setAccountId(user.accountId); // This will cause OtpModal to render
      } else {
        // This case might occur if the backend action succeeds but doesn't return expected data
        setErrorMessage("An unexpected response. Please try again.");
        setIsLoading(false); // Stop loading if modal doesn't open
      }
    } catch (error: any) {
      // Catch the actual error from the async action
      console.error("Authentication error:", error);
      // Provide user-friendly error messages based on common scenarios
      if (error.message && error.message.includes("already exists")) {
        setErrorMessage(
          "Account with this email already exists. Please sign in."
        );
      } else if (error.message && error.message.includes("not found")) {
        setErrorMessage("No account found with this email. Please sign up.");
      } else {
        setErrorMessage("Failed to process request. Please try again.");
      }
      setIsLoading(false); // Stop loading if an error occurs and modal is not shown
    }
    // IMPORTANT: setIsLoading(false) is NOT called here in a `finally` block for `onSubmit`.
    // It is deliberately managed by the `handleOtpModalClose` function,
    // which is called when the OtpModal is actually dismissed.
  };

  // Callback function passed to OtpModal.
  // This function is called when the OtpModal is closed (e.g., by user click, escape key, or successful OTP verification leading to navigation).
  const handleOtpModalClose = () => {
    setIsLoading(false); // Reset the parent form's loading state
    setAccountId(null); // Clear accountId to unmount the OtpModal
    form.reset(); // Optionally, reset the form fields to clear inputs
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>

          {/* Full Name field (conditionally rendered for Sign Up) */}
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          {/* Email field (for both Sign In and Sign Up) */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="shad-input"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading} // The button is disabled when isLoading is true
          >
            {type === "sign-in" ? "Sign In" : "Sign Up"}
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>

          {/* Display general error message if any */}
          {errorMessage && <p className="error-message">*{errorMessage}</p>}

          {/* Link to switch between Sign In/Sign Up forms */}
          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand"
            >
              {" "}
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>

      {/* Conditionally render the OtpModal if an accountId is available */}
      {accountId && (
        <OtpModal
          email={form.getValues("email")} // Pass the email to the modal
          accountId={accountId} // Pass the accountId to the modal
          onClose={handleOtpModalClose} // Pass the callback to manage parent's state on modal close
        />
      )}
    </>
  );
};

export default AuthForm;
