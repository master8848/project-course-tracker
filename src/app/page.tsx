/**
 * v0 by Vercel.
 * @see https://v0.dev/t/PmwTvNfrVgf
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="h-screen w-screen flex items-center justify-center ">
      <div className=" h-fit">
        <Button
          className="h-full text-8xl"
          onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
        >
          Sign In
        </Button>
      </div>
    </main>
  );
}
