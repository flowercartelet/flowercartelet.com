export default function compareScreenshots(screenshot, otherScreenshot) {
  if ((!screenshot && otherScreenshot) || (screenshot && !otherScreenshot)) {
    return false;
  }
  const { original: image } = (screenshot || {}).image || {};
  const { original: otherImage } = (otherScreenshot || {}).image || {};
  return image && otherImage && image.url == otherImage.url;
}
