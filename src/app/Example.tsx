"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const example = [
  {
    name: "typescript",
    code: `type Row = {\n   name: string\n}`,
  },
  {
    name: "javascript",
    code: `type Row = {\n   name: string\n}`,
  },
  {
    name: "python",
    code: `python code`,
  },
  {
    name: "golang",
    code: `golang code`,
  },
];

export default function ExampleCode({
  onClick,
  disabled,
}: {
  onClick: Function;
  disabled: boolean;
}) {
  return (
    <div className="w-full flex flex-row space-x-4 rounded-md px-4 lg:px-8 py-4 backdrop-blur-3xl bg-transparent border border-shark-600 bg-shark-950">
      <FontAwesomeIcon icon={faInfoCircle} className="text-shark-400 my-1" />
      <div className="flex flex-col w-full">
        <h3 className="font-semibold text-xl mb-2">Getting Started</h3>
        <p>
          Generate JSON from{" "}
          <span className="font-semibold underline text-green-300">any</span>{" "}
          programming language. Click icon to see example
        </p>
        <div className="flex flex-row flex-wrap mt-4">
          {example.map((lang) => {
            return (
              <button
                key={lang.name}
                disabled={disabled}
                onClick={(e) => onClick(lang.code)}
                className="bg-shark-950 w-16 h-16 mr-4 mt-4 flex justify-center items-center rounded-md border border-shark-600 hover:border-shark-500"
              >
                <Image
                  src={`/icon/${lang.name}.svg`}
                  alt={lang.name}
                  width={32}
                  height={32}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
