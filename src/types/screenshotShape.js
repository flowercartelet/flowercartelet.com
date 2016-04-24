import { PropTypes } from 'react';
import imageShape from './imageShape';

export default PropTypes.shape({
  createdAt: PropTypes.string.isRequired,
  images: PropTypes.objectOf(imageShape)
});
