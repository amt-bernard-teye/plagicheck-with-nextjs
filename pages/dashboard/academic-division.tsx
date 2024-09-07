import Head from "next/head";

import Dashboard from "@/components/layouts/dashboard/dashboard";

export default function AcademicDivision() {
  return (
    <>
      <Head>
        <title>Plagiarism Checker | Academic Division</title>
        <meta name="description" content="Plagiarism Checker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <Dashboard>
        <h1>Testing</h1>
      </Dashboard>
    </>
  );
}