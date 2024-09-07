import Head from "next/head";

import Dashboard from "@/components/layouts/dashboard/dashboard";
import PageHeader from "@/components/organisms/page-header/page-header";

export default function PlagiarismChecker() {
  return (
    <>
      <Head>
        <title>Plagiarism Checker | Checker</title>
        <meta name="description" content="Plagiarism Checker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <Dashboard>
        <PageHeader />
        <h1>Testing</h1>
      </Dashboard>
    </>
  );
}