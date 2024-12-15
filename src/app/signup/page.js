"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/services/user";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const SignUp = () => {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await signUp(data);
            console.log(response);

            if (response.status === 201) {
                message.success("Signup Successful")
                router.push("/submission");
            } else {

                throw new Error("Signup failed");
            }
        } catch (error) {

            console.error(error);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-dvh">
            <Card className="mx-auto max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Signup</CardTitle>
                    <CardDescription>Enter your email and password to signup</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                {...register("email", { required: "Email is required" })}
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                {...register("password", { required: "Password is required" })}
                            />
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Signing up..." : "Signup"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUp;
