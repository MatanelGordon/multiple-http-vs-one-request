const app = document.getElementById("app");

export const addCard = (
  options = {
    id: undefined,
    color: undefined,
    text: undefined,
    time: undefined,
  },
  container = app
) => {
  const node = document.createElement("div");
  node.classList.add(
    "pending",
    "border-2",
    "py-3",
    "px-5",
    "font-bold",
    "border-cardColor",
    "text-cardColor",
    "text-center",
    "rounded-lg",
    "w-80",
    "my-1"
  );

  node.textContent = "Pending...";

  container.appendChild(node);

  const clearCard = () => {
    node.classList.remove("pending", "time", "normal", "success");
  };

  const successCard = () => {
    clearCard();
    node.classList.add("success");
    node.textContent = "Success!";
  };

  const failCard = () => {
    clearCard();
    node.classList.add("failed");
    node.textContent = "ERROR!";
  };

  const normalCard = () => {
    node.classList.add("normal");
  };

  const setTime = (time) => {
    clearCard();
    node.classList.add("time");
    node.textContent = `${time} [ms]`;
  };

  const setText = (text) => {
    node.textContent = text;
  };

  options.id && node.setAttribute("id", id);
  options.color === "normal" && normalCard();
  options.color === "success" && successCard();
  options.color === "failed" && failedCard();
  options.text && setText(options.text);
  options.time && setTime(options.time);

  return {
    node,
    successCard,
    failCard,
    normalCard,
    clearCard,
    setTime,
    setText,
    remove: () => {
      node.remove();
    },
  };
};

export const addDivider = (container = app) => {
  const divider = document.createElement("i");
  divider.classList.add("w-1/2", "h-0.5", "bg-gray-500", "my-5");
  if (container) {
    container.appendChild(divider);
  }
  return divider;
};

export const addTitle = (content, container = app, element = "h2") => {
  const header = document.createElement(element);
  header.textContent = content;
  container.appendChild(header);
  return header;
};
