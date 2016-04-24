export const ADD_SCREENSHOTS = '@@screenshots/ADD_SCREENSHOTS';

export default function addScreenshotsAction(screenshots) {
  return {
    screenshots,
    type: ADD_SCREENSHOTS
  };
}
