import React, { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import TweetBox from './TweetBox';
import { Tweet } from '../typings';
import TweetComponent from './Tweet';
import { fetchTweets } from '../utils/fetchTweets';

type Props = {
  tweets: Tweet[];
};

const Feed = ({ tweets: tweetsProp }: Props) => {
  const [tweets, setTweets] = useState<Tweet[]>(tweetsProp);

  const handleRefresh = async () => {
    const refreshToast = toast.loading('Refreshing feed...');

    const tweets: Tweet[] = await fetchTweets();
    setTweets(tweets);

    toast.success('Feed updated!', {
      id: refreshToast,
    });
  };

  return (
    <div className="lg:mr-2 col-span-7 max-h-screen overflow-y-scroll border-x scrollbar-hide lg:col-span-5">
      <div className="flex items-center justify-between">
        <h1 className="p-5 pb-0 text-xl font-bold">Home</h1>
        <ArrowPathIcon
          className="mr-5 mt-5 h-8 w-8 cursor-pointer text-twitter transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
          onClick={handleRefresh}
        />
      </div>

      {/* Tweet Box */}
      <div>
        <TweetBox setTweets={setTweets} />
      </div>

      {/* Tweets */}
      <div>
        {tweets.map((tweet) => (
          <TweetComponent key={tweet._id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
