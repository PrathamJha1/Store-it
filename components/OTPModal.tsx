"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { verifySecret, sendEmailOTP } from "@/lib/actions/users.actions";
import { useRouter } from "next/navigation";

// Define the props interface for OtpModal, including the new 'onClose' prop
interface OtpModalProps {
  accountId: string;
  email: string;
  onClose: () => void; // This function will be called when the modal closes
}

const OtpModal = ({ accountId, email, onClose }: OtpModalProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true); // Modal is open by default when rendered
  const [password, setPassword] = useState(""); // State for the OTP input
  const [isLoading, setIsLoading] = useState(false); // State for loading during OTP verification/resend
  const [errorMessage, setErrorMessage] = useState(""); // State for displaying OTP-specific errors

  // This function centralizes the logic for closing the modal and notifying the parent
  const handleCloseModal = () => {
    setIsOpen(false); // Close the internal state of the modal
    onClose(); // Call the onClose prop provided by the parent (AuthForm)
  };

  // Handles the submission of the OTP
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default button behavior
    setIsLoading(true); // Set loading state to true
    setErrorMessage(""); // Clear any previous error messages

    try {
      const sessionId = await verifySecret({ accountId, password });

      if (sessionId) {
        // If OTP is successfully verified, navigate to the home page
        router.push("/");
        // Call handleCloseModal to ensure parent state is reset, though navigation will unmount this component.
        handleCloseModal();
      } else {
        // If verification failed but didn't throw an error (e.g., incorrect OTP)
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      setErrorMessage("Failed to verify OTP. Please try again later.");
    } finally {
      setIsLoading(false); // Always set loading state to false after attempt
    }
  };

  // Handles the request to resend the OTP
  const handleResendOtp = async () => {
    setIsLoading(true); // Set loading state for resend action
    setErrorMessage(""); // Clear any previous errors

    try {
      await sendEmailOTP({ email });
      // Optionally, add a success message here for the user, e.g., "New OTP sent!"
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      setErrorMessage("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false); // Always set loading state to false after resend attempt
    }
  };

  return (
    // AlertDialog controls the modal's open/close state. onOpenChange calls handleCloseModal
    // whenever the modal's open state changes (e.g., clicking outside, pressing Esc).
    <AlertDialog open={isOpen} onOpenChange={handleCloseModal}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter Your OTP
            <Image
              src="/assets/icons/close-dark.svg"
              alt="close"
              width={20}
              height={20}
              onClick={handleCloseModal} // Close button explicitly calls the handler
              className="otp-close-button"
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            We&apos;ve sent a code to{" "}
            <span className="pl-1 text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* OTP Input Field */}
        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className="shad-otp">
            <InputOTPSlot index={0} className="shad-otp-slot" />
            <InputOTPSlot index={1} className="shad-otp-slot" />
            <InputOTPSlot index={2} className="shad-otp-slot" />
            <InputOTPSlot index={3} className="shad-otp-slot" />
            <InputOTPSlot index={4} className="shad-otp-slot" />
            <InputOTPSlot index={5} className="shad-otp-slot" />
          </InputOTPGroup>
        </InputOTP>

        {/* Display Error Message if any */}
        {errorMessage && (
          <p className="error-message mt-2 text-center">{errorMessage}</p>
        )}

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            {/* Submit OTP Button */}
            <AlertDialogAction
              onClick={handleSubmit}
              className="shad-submit-btn h-12"
              type="button" // Important: ensures it's a button, not a form submit
              disabled={isLoading || password.length < 6} // Disable if loading or OTP is not fully entered
            >
              Submit
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </AlertDialogAction>

            {/* Resend OTP Link/Button */}
            <div className="subtitle-2 mt-2 text-center text-light-100">
              Didn&apos;t get a code?
              <Button
                type="button" // Ensures this is a button, not a form submit
                variant="link"
                className="pl-1 text-brand"
                onClick={handleResendOtp}
                disabled={isLoading} // Disable resend button while any action is pending
              >
                Click to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;
