import { ADD_SCREENSHOTS } from '../actions/addScreenshotsAction';
import { SET_CURRENT_SCREENSHOT } from '../actions/setCurrentScreenshotAction';
import { SET_SCREENSHOT_LIST_URI } from '../actions/setScreenshotListUriAction';

export const initialState = {
  currentScreenshot: null,
  screenshotListUri: null,
  screenshots: []
};

export default function screenshotsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_SCREENSHOTS:
      return {
        ...state,
        screenshots: [
          ...state.screenshots,
          ...action.screenshots
        ]
      };
    case SET_CURRENT_SCREENSHOT:
      return { ...state, currentScreenshot: action.screenshot };
    case SET_SCREENSHOT_LIST_URI:
      return { ...state, screenshotListUri: action.screenshotListUri };
    default:
      return state;
  }
}
