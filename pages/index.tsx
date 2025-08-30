import type { NextPage } from 'next';
import Head from 'next/head';
import Dashboard from '../components/Dashboard';
import "../src/app/globals.css"

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Frame Dashboard</title>
        <meta name="description" content="High-performance franchise management dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <Dashboard />
    </>
  );
};

export default Home;