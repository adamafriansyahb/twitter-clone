import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import {
  CalendarIcon,
  FaceSmileIcon,
  MagnifyingGlassCircleIcon,
  MapPinIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { Tweet, TweetBody } from '../typings';
import { fetchTweets } from '../utils/fetchTweets';

type Props = {
  setTweets: React.Dispatch<React.SetStateAction<Tweet[]>>;
};

const TweetBox = ({ setTweets }: Props) => {
  const { data: session } = useSession();

  const [tweet, setTweet] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [isImageUrlBoxOpen, setIsImageUrlBoxOpen] = useState<boolean>(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const postTweet = async () => {
    const tweetBody: TweetBody = {
      text: tweet,
      username: session?.user?.name || 'Unknown User',
      profileImg: session?.user?.image || 'https://links.papareact.com/gll',
      image,
    };

    const result = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/addTweet`,
      {
        body: JSON.stringify(tweetBody),
        method: 'POST',
      }
    );

    const json = await result.json();

    const newTweets: Tweet[] = await fetchTweets();
    setTweets(newTweets);

    toast('Tweet posted.', {
      icon: '🚀',
    });

    return json;
  };

  const handleSubmitTweet = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    postTweet();

    setTweet('');
    setImage('');
    setIsImageUrlBoxOpen(false);
  };

  const addImageToTweet = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!imageInputRef.current?.value) return;

    setImage(imageInputRef.current.value);
    imageInputRef.current.value = '';
    setIsImageUrlBoxOpen(false);
  };

  return (
    <div className="flex space-x-2 p-5">
      <Image
        alt="avatar"
        className="mt-4 h-14 w-14 rounded-full object-cover"
        height={56}
        src={session?.user?.image || 'https://links.papareact.com/gll'}
        width={56}
      />

      <div className="flex flex-1 items-center pl-2">
        <form className="flex flex-1 flex-col">
          <input
            className="h-20 w-full text-xl outline-none placeholder:text-xl"
            onChange={(e) => setTweet(e.target.value)}
            placeholder="What's happening?"
            type="text"
            value={tweet}
          />

          <div className="flex items-center">
            <div className="flex flex-1 space-x-2 text-twitter">
              <PhotoIcon
                className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150"
                onClick={() => setIsImageUrlBoxOpen(!isImageUrlBoxOpen)}
              />
              <MagnifyingGlassCircleIcon className="h-5 w-5" />
              <FaceSmileIcon className="h-5 w-5" />
              <CalendarIcon className="h-5 w-5" />
              <MapPinIcon className="h-5 w-5" />
            </div>
            <button
              className="rounded-full bg-twitter px-5 py-2 font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!session || !tweet}
              onClick={handleSubmitTweet}
            >
              Tweet
            </button>
          </div>

          {isImageUrlBoxOpen && (
            <form className="mt-5 flex rounded-lg bg-twitter/80 py-2 px-4">
              <input
                className="flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white"
                placeholder="Enter image URL..."
                ref={imageInputRef}
                type="text"
              />
              <button
                className="font-bold text-white"
                onClick={addImageToTweet}
              >
                Add Image
              </button>
            </form>
          )}

          {image && (
            <Image
              alt="upload-image"
              className="mt-10 h-40 w-full object-contain shadow-lg"
              height={160}
              src={image}
              width={160}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default TweetBox;
