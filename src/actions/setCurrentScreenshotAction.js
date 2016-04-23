export const SET_CURRENT_SCREENSHOT = '@@screenshots/SET_CURRENT_SCREENSHOT';

export default function setCurrentScreenshotAction(screenshot) {
  return {
    type: SET_CURRENT_SCREENSHOT,
    screenshot
  };
}
