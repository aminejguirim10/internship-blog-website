"use client"

import { useUser, useAuth } from "@clerk/nextjs"
import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs"

export default function Navbar() {
  const { isSignedIn, user, isLoaded } = useUser()
  const { signOut } = useAuth()

  // Afficher un loader pendant le chargement
  if (!isLoaded) {
    return <div>Chargement...</div>
  }

  return (
    <div className="flex flex-col gap-8">
      <nav>
        {isSignedIn ? (
          <div>
            <span>Bonjour {user.firstName}</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <SignInButton />
        )}
      </nav>
    </div>
  )
}
