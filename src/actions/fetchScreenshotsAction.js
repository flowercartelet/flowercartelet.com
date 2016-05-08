import addScreenshotsAction from './addScreenshotsAction';
import parseJson from '../utils/parseJson';

const TWO_HOURS = 2 * 60 * 60 * 1000;

export const cache = {};

export default function fetchScreenshotsAction(screenshotListUri) {
  return function(dispatch) {
    const {
      expiredAt,
      screenshots: cachedScreenshots
    } = cache;
    const now = Date.now();
    if (
      typeof cachedScreenshots !== 'undefined' &&
      cachedScreenshots.length > 0 &&
      expiredAt >= now
    ) {
      return dispatch(addScreenshotsAction(cachedScreenshots));
    }
    return fetch(screenshotListUri).then(parseJson).then(function(screenshots) {
      Object.assign(cache, {
        expiredAt: now + TWO_HOURS,
        screenshots
      });
      dispatch(addScreenshotsAction(screenshots));
    });
  };
};
