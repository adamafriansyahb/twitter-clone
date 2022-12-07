import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import TimeAgo from 'react-timeago';
import toast from 'react-hot-toast';
import {
  ArrowUpTrayIcon,
  ArrowsRightLeftIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { Comment, CommentBody, Tweet } from '../typings';
import { fetchComments } from '../utils/fetchComments';

type Props = {
  tweet: Tweet;
};

const Tweet = ({ tweet }: Props) => {
  const { data: session } = useSession();

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState<boolean>(false);

  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id);
    setComments(comments);
  };

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const commentToast = toast.loading('Posting comment...');

    const comment: CommentBody = {
      comment: newComment,
      tweetId: tweet._id,
      username: session?.user?.name || 'Unknown User',
      profileImg: session?.user?.image || 'https://links.papareact.com/gll',
    };

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/addComment`,
      {
        body: JSON.stringify(comment),
        method: 'POST',
      }
    );

    toast.success('Comment posted.', {
      id: commentToast,
    });

    setNewComment('');
    setIsCommentBoxOpen(false);
    refreshComments();
  };

  useEffect(() => {
    refreshComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col space-x-3 border-y border-gray-100 p-5">
      <div className="flex space-x-3">
        <Image
          alt="profile-image"
          className="h-10 w-10 rounded-full object-cover"
          height={40}
          src={tweet.profileImg}
          width={40}
        />

        <div>
          <div className="flex items-center space-x-1">
            <p className="mr-1 font-bold">{tweet.username}</p>
            <p className="hidden text-sm text-gray-500 sm:inline">
              @{tweet.username.replace(/\s+/g, '').toLocaleLowerCase()}
            </p>
            <TimeAgo
              className="text-sm text-gray-500"
              date={tweet._createdAt}
            />
          </div>

          <p className="pt-1">{tweet.text}</p>

          {tweet.image && (
            <Image
              alt="profile-image"
              className="m-5 ml-0 mb-1 max-h-60 rounded-lg object-cover shadow-sm"
              height={240}
              src={tweet.image}
              width={240}
            />
          )}
        </div>
      </div>

      <div className="mt-5 flex justify-between">
        <div
          className="tweet-action-icon-container"
          onClick={() => setIsCommentBoxOpen(!isCommentBoxOpen)}
        >
          <ChatBubbleLeftRightIcon className="tweet-action-icon" />
          <p>{comments.length}</p>
        </div>
        <div className="tweet-action-icon-container">
          <ArrowsRightLeftIcon className="tweet-action-icon" />
        </div>
        <div className="tweet-action-icon-container">
          <HeartIcon className="tweet-action-icon" />
        </div>
        <div className="tweet-action-icon-container">
          <ArrowUpTrayIcon className="tweet-action-icon" />
        </div>
      </div>

      {isCommentBoxOpen && (
        <form className="mt-3 flex space-x-3" onSubmit={handleSubmitComment}>
          <input
            className="flex-1 rounded-lg bg-gray-100 p-2 outline-none"
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            type="text"
            value={newComment}
          />
          <button
            className="text-twitter disabled:text-gray-300"
            disabled={!session || !newComment}
            type="submit"
          >
            Post
          </button>
        </form>
      )}

      {/* Comment Box Logic */}
      {!!comments?.length && (
        <div className="my-2 mt-5 max-h-44 space-y-5 overflow-y-auto border-t border-gray-100 p-5">
          {comments.map((comment) => (
            <div key={comment._id} className="relative flex space-x-2">
              <hr className="absolute left-5 h-8 top-10 border-x border-twitter/30" />

              <Image
                alt="comment-image"
                className="mt-2 h-7 w-7 rounded-full object-cover"
                height={28}
                src={comment.profileImg}
                width={28}
              />

              <div>
                <div className="flex items-center space-x-1">
                  <p className="mr-1 font-bold">{comment.username}</p>
                  <p className="hidden text-sm text-gray-500 lg:inline">
                    @{comment.username.replace(/\s+/g, '').toLocaleLowerCase()}
                  </p>
                  <TimeAgo
                    className="text-sm text-gray-500"
                    date={comment._createdAt}
                  />
                </div>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tweet;
