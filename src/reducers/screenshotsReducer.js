import { ADD_SCREENSHOTS } from '../actions/addScreenshotsAction';
import { SET_CURRENT_SCREENSHOT } from '../actions/setCurrentScreenshotAction';

export const initialState = {
  currentScreenshot: null,
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
    default:
      return state;
  }
}
