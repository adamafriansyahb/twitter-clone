import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Widget from '../components/Widget';
import { fetchTweets } from '../utils/fetchTweets';
import { Tweet } from '../typings';

type Props = {
  tweets: Tweet[];
}

export default function Home({ tweets }: Props) {
  return (
    <div className="mx-auto max-h-screen overflow-hidden lg:max-w-6xl">
      <Head>
        <title>Twitter Clone</title>
        <meta name="description" content="A Twitter clone." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster />

      <main className="grid grid-cols-9">
        <Sidebar />
        <Feed tweets={tweets} />
        <Widget />
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tweets = await fetchTweets();
  
  return {
    props: {
      tweets,
    }
  }
}
