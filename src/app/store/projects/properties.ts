import { Property } from '../models';

export const properties = [
  new Property('id', 'ID', false),
  new Property('name'),
  new Property('description'),
  new Property('created_at', 'Date Created'),
  new Property('created_by', 'Created By'),
  new Property('status'),
];
