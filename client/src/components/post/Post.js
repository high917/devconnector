import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getPost } from '../../actions/post';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from '../post/CommentForm';
import CommentItem from '../post/CommentItem';

const Post = ({ getPost, post: { post, loading }, match }) => {
	useEffect(() => {
		getPost(match.params.id);
	}, [getPost, match.params.id]);
	return loading || post === null ? (
		<Spinner className='mr-tb' />
	) : (
		<div className='mr-tb'>
			<Link to='/posts' className='btn btn-light'>
				Back to Posts
			</Link>
			<PostItem post={post} showActions={false} />
			<CommentForm postId={post._id} />
			<div className='comments'>
				<h1 className='text-dark'>All Comments...</h1>
				{post.comments.map(comment => (
					<CommentItem key={comment._id} comment={comment} postId={post._id} />
				))}
			</div>
		</div>
	);
};

Post.propTypes = {
	getPost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	post: state.post
});

export default connect(
	mapStateToProps,
	{ getPost }
)(Post);
