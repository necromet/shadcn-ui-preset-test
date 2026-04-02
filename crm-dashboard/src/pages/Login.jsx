import { SignIn } from "@clerk/clerk-react"

export function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <img
              src="/images/logos/church-logo.svg"
              alt="Connexion Logo"
              className="size-6 dark:hidden"
            />
            <img
              src="/images/logos/church-logo-dark.svg"
              alt="Connexion Logo"
              className="size-6 hidden dark:block"
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
          <p className="text-sm text-muted-foreground">
            Church Management Dashboard
          </p>
        </div>
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border bg-card",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border border-input bg-background hover:bg-accent",
                socialButtonsBlockButtonText: "text-sm font-medium",
                dividerRow: "my-4",
                dividerText: "text-xs text-muted-foreground",
                formFieldLabel: "text-sm font-medium",
                formFieldInput: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                formButtonPrimary: "bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 text-sm font-medium rounded-md",
                footerActionLink: "text-primary underline-offset-4 hover:underline",
                footerActionText: "text-sm text-muted-foreground",
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
