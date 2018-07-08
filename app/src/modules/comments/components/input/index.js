import withActions from 'hocs/input-with-actions';

import CommentActions from './actions';
import CommentTextarea from './textarea';

export default withActions(CommentTextarea, CommentActions);
