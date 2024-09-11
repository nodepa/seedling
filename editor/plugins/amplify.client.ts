import { Amplify } from 'aws-amplify';
import config from '../amplify_outputs.json';

export default defineNuxtPlugin(() => {
  Amplify.configure(config);
});
