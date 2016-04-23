import { PropTypes } from 'react';

export default PropTypes.shape({
  height: PropTypes.number,
  uri: PropTypes.string.isRequired,
  width: PropTypes.number
});
