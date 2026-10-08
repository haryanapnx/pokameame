import type { UserConfig } from 'vitest/config'

export declare const baseTestConfig: NonNullable<UserConfig['test']>
export declare function baseConfig(overrides?: NonNullable<UserConfig['test']>): UserConfig
