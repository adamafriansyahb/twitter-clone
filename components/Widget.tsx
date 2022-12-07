import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { TwitterTimelineEmbed } from 'react-twitter-embed';

type Props = {};

const Widget = (props: Props) => {
  return (
    <div className="col-span-2 hidden lg:inline">
      {/* Search */}
      <div className="my-2 flex items-center space-x-2 rounded-full bg-gray-100 p-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        <input
          className="flex-1 bg-transparent outline-none"
          placeholder="Search Twitter"
          type="text"
        />
      </div>

      <TwitterTimelineEmbed
        options={{ height: 700 }}
        screenName="cobratate"
        sourceType="profile"
      />
    </div>
  );
};

export default Widget;
