import { match } from 'react-router';
import routes from '../routes';

export default function matchRoutes({ location }) {
  return new Promise(function(resolve, reject) {
    match({
      location,
      routes
    }, function(error, redirectLocation, renderProps) {
      if (error instanceof Error) {
        return reject(error);
      }
      return resolve({ redirectLocation, renderProps });
    })
  });
}
