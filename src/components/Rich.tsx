import { Fragment } from "react";

/** Renders `**figure**` spans as bolded quantitative results. */
export default function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <strong className="fig" key={i}>
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}
