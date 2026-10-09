'use client'

import { useActionState } from 'react'

import { displayName } from '@poke/core'
import { Card, FormField, Input, Select, SubmitButton } from '@poke/ui'

import { createBerryAction, type CreateBerryActionState } from '../../app/berries/actions'
import {
  BERRY_FIRMNESS,
  BERRY_FLAVORS,
  MAX_FLAVOR_POTENCY,
  OPTIONAL_NUMBER_FIELDS,
} from '../../lib/berry-form'

export function AddBerryForm() {
  const [state, formAction] = useActionState<CreateBerryActionState, FormData>(
    createBerryAction,
    null,
  )

  const fieldErrors = state && !state.ok ? (state.error.fieldErrors ?? {}) : {}

  return (
    <form
      action={formAction}
      // React resets the form once a Server Action settles, which wipes everything the user typed
      // as soon as validation fails. Nothing needs clearing here — success redirects away.
      onReset={(event) => event.preventDefault()}
      className="flex flex-col gap-6"
    >
      {state && !state.ok ? (
        <p
          role="alert"
          className="rounded-control border border-danger/40 bg-red-50 px-4 py-3 text-sm text-danger"
        >
          {state.error.message}
        </p>
      ) : null}

      <FormField
        id="name"
        label="Name"
        hint="Lowercase letters, numbers and hyphens."
        error={fieldErrors.name}
        required
      >
        <Input name="name" placeholder="mystery-berry" autoComplete="off" />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField id="firmness" label="Firmness" error={fieldErrors.firmness} required>
          <Select name="firmness" defaultValue="soft">
            {BERRY_FIRMNESS.map((firmness) => (
              <option key={firmness} value={firmness}>
                {displayName(firmness)}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          id="growthTime"
          label="Growth time (hours)"
          error={fieldErrors.growthTime}
          required
        >
          <Input name="growthTime" type="number" min={0} max={168} defaultValue={3} />
        </FormField>
      </div>

      <Card>
        <fieldset>
          <legend className="text-sm font-semibold">
            Flavour potency (0-{MAX_FLAVOR_POTENCY})
          </legend>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {BERRY_FLAVORS.map((flavor, index) => (
              <FormField
                key={flavor}
                id={`flavor-${flavor}`}
                label={displayName(flavor)}
                error={fieldErrors[`flavors.${index}.potency`]}
              >
                <Input
                  name={`flavor-${flavor}`}
                  type="number"
                  min={0}
                  max={MAX_FLAVOR_POTENCY}
                  defaultValue={0}
                />
              </FormField>
            ))}
          </div>
        </fieldset>
      </Card>

      <Card>
        <fieldset>
          <legend className="text-sm font-semibold">Properties</legend>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {OPTIONAL_NUMBER_FIELDS.map((field) => (
              <FormField key={field.key} id={field.key} label={field.label}>
                <Input name={field.key} type="number" min={0} max={255} defaultValue={0} />
              </FormField>
            ))}

            <FormField id="naturalGiftType" label="Natural gift type">
              <Input name="naturalGiftType" placeholder="fire" />
            </FormField>

            <FormField id="itemName" label="Item name">
              <Input name="itemName" placeholder="mystery-berry" />
            </FormField>
          </div>
        </fieldset>
      </Card>

      <div>
        <SubmitButton>Add berry</SubmitButton>
      </div>
    </form>
  )
}
