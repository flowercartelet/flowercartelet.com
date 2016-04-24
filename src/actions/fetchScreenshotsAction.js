import addScreenshotsAction from './addScreenshotsAction';
import parseJson from '../utils/parseJson';

export default function fetchScreenshotsAction(screenshotListUri) {
  return function(dispatch) {
    fetch(screenshotListUri).then(parseJson).then(function(screenshots) {
      dispatch(addScreenshotsAction(screenshots));
    });
  };
};
