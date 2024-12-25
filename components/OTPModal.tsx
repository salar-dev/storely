import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { sendEmailOTP, verifyEmailOTP } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation'



const OTPModal = ({ accountId, email }: { accountId: string, email: string }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = React.useState(true)
    const [otp, setOtp] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            // Call API to verify OTP
            const sessionId = await verifyEmailOTP({ accountId, password: otp })
            if (sessionId) {
                router.push('/');
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            await sendEmailOTP({ email: email });
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className='shad-alert-dialog'>
                <AlertDialogHeader className='relative flex justify-center'>
                    <AlertDialogTitle className='h2 text-center'>Enter your OTP
                        <img src="/assets/icons/close-dark.svg" alt="close" width={24} height={24} className="otp-close-button" onClick={() => setIsOpen(false)} />
                    </AlertDialogTitle>
                    <AlertDialogDescription className='subtitle-2 text-center text-light-100'>
                        We've sent an OTP to <span className='pl-1 text-brand'>{email}</span> Please enter it below.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup className='shad-otp'>
                        <InputOTPSlot index={0} className='shad-otp-slot' />
                        <InputOTPSlot index={1} className='shad-otp-slot' />
                        <InputOTPSlot index={2} className='shad-otp-slot' />
                        <InputOTPSlot index={3} className='shad-otp-slot' />
                        <InputOTPSlot index={4} className='shad-otp-slot' />
                        <InputOTPSlot index={5} className='shad-otp-slot' />
                    </InputOTPGroup>
                </InputOTP>

                <AlertDialogFooter >
                    <div className='flex w-full flex-col gap-4'>
                        <AlertDialogAction onClick={handleSubmit} className='shad-submit-btn h-12' type='button'>
                            Submit
                            {isLoading && <img src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="ml-2 animate-spin" />}
                        </AlertDialogAction>
                        <div className='subtitle-2 mt-2 text-center text-light-100'>
                            Didn't get a code? <button type='button' className='text-brand font-medium' onClick={handleResendOtp}>Resend</button>
                        </div>
                    </div>

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default OTPModal