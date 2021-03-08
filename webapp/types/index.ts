/*
 * Copyright 2021 Phillip Gates-Shannon. All rights reserved. Licensed under
 * the Open Software License version 3.0.
 */

export * as Spotify from './spotify-api';

export interface RefreshErrorResult {
  status: number;
  statusMessage: string;
  body?: Record<string, unknown>;
}

export type RefreshResult = RefreshErrorResult | RefreshSuccessfulResult;

export interface RefreshSuccessfulResult {
  access_token: string;
  expires_in: number;
  scope: string;
  status: number;
  token_type: string;
}
