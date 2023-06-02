"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import {
  faCheck,
  faCircleExclamation,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [payload, setPayload] = useState<string>();
  const [result, setResult] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isClicked, setIsClicked] = useState(false);

  async function generate() {
    if (payload) {
      const { data, error } = await supabase.functions.invoke(
        "generate-json-example",
        {
          body: { payload: payload },
        }
      );

      if (data) {
        setResult(data.example);
        console.log("payload: ", payload, "data: ", data);
      }
      if (error) {
        setErrorMessage(error.message);
        console.log(error);
      }
    }
  }

  function copyResult() {
    navigator.clipboard.writeText(result ? result : "");
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 500);
  }

  return (
    <main className="flex min-h-screen flex-col items-start space-y-10 px-24 py-16">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-4xl">
          <span className="text-green-400 mr-4">{"{ }"}</span>faker
        </h1>
        <Link
          href={"https://github.com/debbyalmadea/faker"}
          className="px-4 py-2 bg-transparent text-neutral-300 border border-neutral-300 hover:bg-neutral-950 active:bg-neutral-900 rounded-md"
        >
          <FontAwesomeIcon icon={faGithub} />
          <span className="ml-4">See Project</span>
        </Link>
      </div>
      <div className="items-center w-full justify-between font-mono text-sm border-b px-8 rounded-lg bg-gradient-to-b pb-6 pt-8 backdrop-blur-3xl border-neutral-800 bg-zinc-800/30 from-inherit lg:bg-gray-200 lg:bg-zinc-800/30">
        <div className="flex flex-row space-x-3">
          <div className="bg-red-400 w-3 h-3 rounded-full" />
          <div className="bg-yellow-400 w-3 h-3 rounded-full" />
          <div className="bg-green-400 w-3 h-3 rounded-full" />
        </div>
        <textarea
          autoFocus
          rows={16}
          onChange={(e) => {
            setPayload(e.target.value);
            console.log(e.target.value);
          }}
          className="focus:outline-none w-full bg-transparent pt-8"
        />
      </div>
      <button
        onClick={generate}
        className="px-4 py-2 bg-green-400 hover:bg-green-300 active:bg-green-500 text-green-950 rounded-md"
      >
        Generate
      </button>
      {errorMessage && (
        <div className="flex flex-row px-8 py-4 w-full space-x-4 rounded-md border items-start justify-between border-rose-600 bg-rose-950">
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="text-rose-400 my-1"
          />
          <div className="flex flex-col w-full">
            <h3 className="font-bold">Failed to generate example</h3>
            <p>{errorMessage}</p>
          </div>
          <FontAwesomeIcon icon={faClose} className="text-rose-400 my-1" />
        </div>
      )}
      {result && (
        <div className="flex flex-row justify-between w-full">
          <pre className="font-mono">{result}</pre>
          <button
            onClick={copyResult}
            className={`${
              !isClicked && "w-10"
            } h-10 bg-transparent text-green-300 border border-green-300 hover:bg-green-950 active:bg-green-900 rounded-md`}
          >
            {isClicked ? (
              <div className="flex flex-row items-center px-4 space-x-2">
                <FontAwesomeIcon icon={faCheck} />
                <p>copied</p>
              </div>
            ) : (
              <FontAwesomeIcon icon={faCopy} />
            )}
          </button>
        </div>
      )}
    </main>
  );
}
