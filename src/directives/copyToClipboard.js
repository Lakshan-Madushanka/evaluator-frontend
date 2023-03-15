function createElm(el, targetElmId) {
  let container = document.createElement("div");
  let icon = document.createElement("i");

  el.style.position = "relative";

  icon.className = "pi pi-copy hover:cursor-pointer";

  icon.style.padding = "3px";
  icon.style.backgroundColor = "white";
  icon.style.border = "2px solid blue";
  icon.style.borderRadius = "100px";
  icon.style.fontSize = "12px";

  container.style.position = "absolute";
  container.style.right = "-2.2rem";
  container.style.top = "-3px";

  container.appendChild(icon);

  el.addEventListener("click", () => copyToClipBoard(container, targetElmId));

  el.appendChild(container);
}

function createToast(element) {
  let span = document.createElement("span");

  span.style.position = "absolute";
  span.style.fontWeight = "bold";
  span.style.left = "2rem";
  span.style.bottom = "1px";
  span.style.padding = "2px";
  span.style.backgroundColor = "white";

  span.textContent = "copied";

  element.appendChild(span);

  setTimeout(() => span.remove(), 1000);
}

function copyToClipBoard(element, targetElmId) {
  const target = getTarget(targetElmId);

  let content = target.value;

  if (target.value === undefined) {
    content = target.textContent;
  }

  navigator.clipboard.writeText(content);

  createToast(element);
}

function getTarget(targetElmId) {
  const target = document.querySelector("#" + targetElmId);

  return target;
}

export default {
  beforeMount: (el, binding) => {
    createElm(el, binding.value);
  },
};
