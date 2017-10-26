import { RouterNavigationPayload, ROUTER_NAVIGATION } from '@ngrx/router-store';

import { actionCreatorFactory } from 'typescript-fsa';

import { StoreItem } from './models';
import { RouterState } from './state';

function action<Payload>(family: string, type: string) {
  const actionCreator = actionCreatorFactory(family);
  return actionCreator<Payload>(type);
}

export const login = action<string>('auth', 'LOGIN');
export const loginSuccess = action<string>('auth', 'LOGIN_SUCCESS');
export const loginRedirect = action<string>('auth', 'LOGIN_REDIRECT');
export const logout = actionCreatorFactory('auth')('LOGOUT');

export const storage = action<string>('@ngrx/store', 'storage');

export type CreatePayload<Item extends StoreItem> = Partial<Item>;

export function create<Item extends StoreItem>(type: string) {
  return action<CreatePayload<Item>>(type, 'CREATE');
}

export function createSuccess<Item extends StoreItem>(type: string) {
  return action<Item>(type, 'CREATE_SUCCESS');
}

export interface UpdatePayload<Item extends StoreItem> {
  id: string;
  changes: Partial<Item>;
}

export function update<Item extends StoreItem>(type: string) {
  return action<UpdatePayload<Item>>(type, 'UPDATE');
}

export function updateSuccess<Item extends StoreItem>(type: string) {
  return action<UpdatePayload<Item>>(type, 'UPDATE_SUCCESS');
}

export function get(type: string) {
  return action<string>(type, 'GET');
}

export function getSuccess<Item extends StoreItem>(type: string) {
  return action<Item>(type, 'GET_SUCCESS');
}

export interface ListPayload {
  limit?: number;
}

export function list(type: string) {
  return action<ListPayload>(type, 'LIST');
}

export function listSuccess<Item extends StoreItem>(type: string) {
  return action<Item[]>(type, 'LIST_SUCCESS');
}

export const routerNavigation =
  action<RouterNavigationPayload<RouterState>>(undefined, ROUTER_NAVIGATION);
