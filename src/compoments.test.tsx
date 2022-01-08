import { Square, calculateWinner } from "./compoments";
import type { SquareValue } from "./compoments";

import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

let container: Element | null = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  container.setAttribute("id", "root");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;
});

test("smoke", () => {
  expect(1 + 1).toBe(2);
});

test("no winner", () => {
  let squares: SquareValue[] = [];
  expect(calculateWinner(squares.fill(null))).toBeNull();
});

test("X is winner", () => {
  expect(
    calculateWinner(["X", "X", "X", "O", "O", null, "O", null, null])
  ).toEqual({ line: [0, 1, 2], player: "X" });
});

test("O is winner", () => {
  expect(
    calculateWinner(["X", "O", "X", "X", "O", "X", "O", "O", null])
  ).toEqual({ line: [1, 4, 7], player: "O" });
});

test("Square renders with square value", () => {
  act(() => {
    render(
      <Square value={null} onClick={() => {}} highlight={false} />,
      container
    );
  });
  expect(container!.textContent).toBe("");

  act(() => {
    render(
      <Square value={"X"} onClick={() => {}} highlight={false} />,
      container
    );
  });
  expect(container!.textContent).toBe("X");

  act(() => {
    render(
      <Square value={"O"} onClick={() => {}} highlight={false} />,
      container
    );
  });
  expect(container!.textContent).toBe("O");
});

test("Square renders with or without highlight", () => {
  act(() => {
    render(
      <Square value={"X"} onClick={() => {}} highlight={true} />,
      container
    );
  });
  expect(container!.querySelector("button")?.className).toBe(
    "square highlight"
  );

  act(() => {
    render(
      <Square value={"X"} onClick={() => {}} highlight={false} />,
      container
    );
  });
  expect(container!.querySelector("button")?.className).toBe("square");
});
