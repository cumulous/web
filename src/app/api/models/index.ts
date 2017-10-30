export { Project } from './project';
export { Dataset } from './dataset';
export { Analysis } from './analysis';
export { User } from './user';
export { Client } from './client';

interface Params {
  [key: string]: string | number | undefined;
}

export function requestParams(p: Params) {
  const params: { [key: string]: string } = {};
  Object.keys(p)
    .filter(key => p[key] !== undefined)
    .forEach(key => {
      params[key] = String(p[key]);
    });
  return { params };
}

export interface ListParams extends Params {
  limit?: number;
};

export interface ListResponse<Item> {
  items: Item[];
}
