export const SET_SCREENSHOT_LIST_URI = '@@screenshots/SET_SCREENSHOT_LIST_URI';

export default function setScreenshotListUriAction(screenshotListUri) {
  return {
    screenshotListUri,
    type: SET_SCREENSHOT_LIST_URI
  };
}
