import axios from 'axios';
import config from '../config/env';
import { SHOW_ORG_DIALOG } from './types';

export function toggleOrgDialog(show) {
  return {
    type: SHOW_ORG_DIALOG,
    payload: show
  };
}
