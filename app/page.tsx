import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-background min-h-screen text-foreground">
      <h1>HEllo WELocome</h1>
      <SignedOut>
        <SignUpButton mode="modal">Sign up</SignUpButton>
      </SignedOut>
      <SignedOut>
        <SignInButton mode="modal">Login</SignInButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton>Log out</SignOutButton>
      </SignedIn>
    </div>
  );
}
