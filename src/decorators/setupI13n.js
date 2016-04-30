import { setupI13n } from 'react-i13n';

export default function setupI13nDecorator(...args) {
  return function(component) {
    return setupI13n(component, ...args);
  }
}
