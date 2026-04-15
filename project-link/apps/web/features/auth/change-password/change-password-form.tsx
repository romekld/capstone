"use client"

import { useActionState, useEffect, useState } from "react"
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { changePasswordAction } from "./actions"

type ChangePasswordFormProps = {
  formId?: string
  onPendingChange?: (isPending: boolean) => void
  onSuccess?: () => void
}

export function ChangePasswordForm({
  formId,
  onPendingChange,
  onSuccess,
}: ChangePasswordFormProps) {
  const [state, action, isPending] = useActionState(changePasswordAction, null)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (state?.success) {
      onSuccess?.()
    }
  }, [onSuccess, state])

  useEffect(() => {
    onPendingChange?.(isPending)
  }, [isPending, onPendingChange])

  return (
    <form id={formId} action={action} className="flex flex-col gap-6">
      <FieldGroup>
        {state?.error && (
          <Alert variant="destructive" className="p-3">
            <AlertCircleIcon />
            <AlertDescription className="text-xs">{state.error}</AlertDescription>
          </Alert>
        )}

        <Field>
          <FieldLabel htmlFor="newPassword">New password</FieldLabel>
          <div className="relative">
            <Input
              id="newPassword"
              name="newPassword"
              type={showNew ? "text" : "password"}
              placeholder="At least 12 characters"
              required
              autoComplete="new-password"
              className="h-10 bg-background pr-11"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-1 my-auto size-8 transition-none active:translate-y-0"
              onClick={() => setShowNew((value) => !value)}
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your new password"
              required
              autoComplete="new-password"
              className="h-10 bg-background pr-11"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-1 my-auto size-8 transition-none active:translate-y-0"
              onClick={() => setShowConfirm((value) => !value)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  )
}
