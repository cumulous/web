import { RouterNavigationPayload, ROUTER_NAVIGATION } from '@ngrx/router-store';

import { actionCreatorFactory } from 'typescript-fsa';

import { ListParams } from '../api';
import { StoreItem } from './models';
import { RouterState } from './state';

function action<Payload>(family: string | null, type: string) {
  const actionCreator = actionCreatorFactory(family);
  return actionCreator<Payload>(type);
}

export const login = action<string>('auth', 'LOGIN');
export const loginSuccess = action<string>('auth', 'LOGIN_SUCCESS');
export const loginFailure = action<Error>('auth', 'LOGIN_FAILURE');
export const loginRedirect = action<string>('auth', 'LOGIN_REDIRECT');
export const logout = actionCreatorFactory('auth')('LOGOUT');

export const storage = action<string>('@ngrx/store', 'storage');

type CreatePayload<Item extends StoreItem> = Partial<Item>;

export function create<Item extends StoreItem>(type: string) {
  return action<CreatePayload<Item>>(type, 'CREATE');
}

export function createSuccess<Item extends StoreItem>(type: string) {
  return action<Item>(type, 'CREATE_SUCCESS');
}

export function createFailure(type: string) {
  return action<Error>(type, 'CREATE_FAILURE');
}

interface UpdatePayload<Item extends StoreItem> {
  id: string;
  changes: Partial<Item>;
}

export function update<Item extends StoreItem>(type: string) {
  return action<UpdatePayload<Item>>(type, 'UPDATE');
}

export function updateSuccess<Item extends StoreItem>(type: string) {
  return action<UpdatePayload<Item>>(type, 'UPDATE_SUCCESS');
}

export function updateFailure(type: string) {
  return action<Error>(type, 'UPDATE_FAILURE');
}

export function get(type: string) {
  return action<string>(type, 'GET');
}

export function getSuccess<Item extends StoreItem>(type: string) {
  return action<Item>(type, 'GET_SUCCESS');
}

export function getFailure(type: string) {
  return action<Error & { id: string }>(type, 'GET_FAILURE');
}

export function list(type: string) {
  return action<ListParams>(type, 'LIST');
}

export function listSuccess<Item extends StoreItem>(type: string) {
  return action<Item[]>(type, 'LIST_SUCCESS');
}

export function listFailure(type: string) {
  return action<Error>(type, 'LIST_FAILURE');
}

export const routerNavigation =
  action<RouterNavigationPayload<RouterState>>(null, ROUTER_NAVIGATION);
