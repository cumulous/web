import { Property } from '../models';

export const properties = [
  new Property('id', 'ID', false),
  new Property('description'),
  new Property('project_id', 'Project'),
  new Property('created_at', 'Date Created'),
  new Property('created_by', 'Created By', false),
  new Property('status'),
];
