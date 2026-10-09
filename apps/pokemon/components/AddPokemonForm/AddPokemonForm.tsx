'use client'

import { useActionState, useState, type ChangeEvent } from 'react'

import { displayName } from '@poke/core'
import { Card, Checkbox, FormField, Input, POKEMON_TYPES, Select, SubmitButton } from '@poke/ui'

import { createPokemonAction, type CreatePokemonActionState } from '../../app/pokemon/actions'
import { STAT_KEYS, STAT_LABELS } from '../../lib/pokemon-form'

const MAX_TYPES = 2
const ABILITY_LIST_ROWS = 8

export type AddPokemonFormProps = {
  abilityNames: string[]
}

function selectedValues(event: ChangeEvent<HTMLSelectElement>): string[] {
  return Array.from(event.target.selectedOptions, (option) => option.value)
}

export function AddPokemonForm({ abilityNames }: AddPokemonFormProps) {
  const [state, formAction] = useActionState<CreatePokemonActionState, FormData>(
    createPokemonAction,
    null,
  )
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [abilities, setAbilities] = useState<string[]>([])
  const [hiddenAbilities, setHiddenAbilities] = useState<string[]>([])

  const fieldErrors = state && !state.ok ? (state.error.fieldErrors ?? {}) : {}
  const typesFull = selectedTypes.length >= MAX_TYPES

  const onAbilitiesChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = selectedValues(event)
    setAbilities(next)
    setHiddenAbilities((current) => current.filter((name) => next.includes(name)))
  }

  return (
    <form
      action={formAction}
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
        <Input name="name" placeholder="pikablu" autoComplete="off" />
      </FormField>

      <fieldset>
        <legend className="text-sm font-medium text-content">Types (max {MAX_TYPES})</legend>

        <div className="mt-2 flex flex-wrap gap-2">
          {POKEMON_TYPES.map((type) => {
            const checked = selectedTypes.includes(type)

            return (
              <label
                key={type}
                className="inline-flex items-center gap-2 rounded-control border border-border-subtle bg-surface px-2.5 py-1.5 text-xs capitalize"
              >
                <Checkbox
                  name="types"
                  value={type}
                  checked={checked}
                  disabled={!checked && typesFull}
                  onChange={(event) => {
                    setSelectedTypes((current) =>
                      event.target.checked
                        ? [...current, type]
                        : current.filter((selected) => selected !== type),
                    )
                  }}
                />
                {type}
              </label>
            )
          })}
        </div>

        {fieldErrors.types ? <p className="mt-2 text-xs text-danger">{fieldErrors.types}</p> : null}
      </fieldset>

      <FormField
        id="abilities"
        label="Abilities"
        hint={
          abilityNames.length > 0
            ? 'Cmd/Ctrl-click to pick several from the PokeAPI list.'
            : 'The ability list is unavailable right now — try again later.'
        }
        error={fieldErrors.abilities}
      >
        <Select
          name="abilities"
          multiple
          size={ABILITY_LIST_ROWS}
          value={abilities}
          onChange={onAbilitiesChange}
          disabled={abilityNames.length === 0}
          className="h-auto min-h-40"
        >
          {abilityNames.map((ability) => (
            <option key={ability} value={ability}>
              {displayName(ability)}
            </option>
          ))}
        </Select>
      </FormField>

      {abilities.length > 0 ? (
        <FormField
          id="hidden-abilities"
          label="Hidden abilities"
          hint="Pick which of the selected abilities are hidden."
        >
          <Select
            name="hidden-abilities"
            multiple
            size={Math.min(4, abilities.length)}
            value={hiddenAbilities}
            onChange={(event) => setHiddenAbilities(selectedValues(event))}
            className="h-auto min-h-24"
          >
            {abilities.map((ability) => (
              <option key={ability} value={ability}>
                {displayName(ability)}
              </option>
            ))}
          </Select>
        </FormField>
      ) : null}

      <fieldset>
        <legend className="text-sm font-medium text-content">Details (optional)</legend>

        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <FormField id="height" label="Height (m)" hint="e.g. 0.7" error={fieldErrors.height}>
            <Input name="height" type="number" min={0} max={100} step="0.1" placeholder="0.7" />
          </FormField>

          <FormField id="weight" label="Weight (kg)" hint="e.g. 6.9" error={fieldErrors.weight}>
            <Input name="weight" type="number" min={0} max={1000} step="0.1" placeholder="6.9" />
          </FormField>

          <FormField
            id="base-experience"
            label="Base experience"
            hint="e.g. 64"
            error={fieldErrors.baseExperience}
          >
            <Input
              name="base-experience"
              type="number"
              min={0}
              max={1000}
              step={1}
              placeholder="64"
            />
          </FormField>
        </div>
      </fieldset>

      <Card>
        <fieldset>
          <legend className="text-sm font-semibold">Base stats</legend>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {STAT_KEYS.map((key, index) => (
              <FormField
                key={key}
                id={`stat-${key}`}
                label={STAT_LABELS[key]}
                error={fieldErrors[`stats.${index}.value`]}
              >
                <Input name={`stat-${key}`} type="number" min={1} max={255} defaultValue={50} />
              </FormField>
            ))}
          </div>
        </fieldset>
      </Card>

      <div>
        <SubmitButton>Add Pokemon</SubmitButton>
      </div>
    </form>
  )
}
