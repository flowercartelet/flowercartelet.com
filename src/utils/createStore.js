import {
  applyMiddleware as reduxApplyMiddleware,
  createStore as reduxCreateStore
} from 'redux';
import thunk from 'redux-thunk';

export default function createStore(reducers) {
  const createStoreWithMiddleware = reduxApplyMiddleware(
    thunk
  )(reduxCreateStore);
  const store = createStoreWithMiddleware(reducers);
  return store;
}
