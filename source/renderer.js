"use strict;";

// get css files from main process
document.querySelector("head").innerHTML += ipcRenderer
  .sendSync("css")
  .reduce(
    (csslinks, cssfile) => (
      (csslinks += `<link rel="stylesheet" type="text/css" href="${cssfile}">\n`),
      csslinks
    ),
    ""
  );

var currentValue = {
  progress: null,
  text: null,
  detail: null
};

var elements = {
  text: document.querySelector("#text"),
  detail: document.querySelector("#detail"),
  progressBarContainer: document.querySelector("#progressBarContainer"),
  progressBar: null // set by createProgressBar()
};

function createProgressBar(settings) {
  if (settings.indeterminate) {
    var progressBar = document.createElement("div");
    progressBar.setAttribute("id", "progressBar");
    progressBar.classList.add("indeterminate");

    var progressBarValue = document.createElement("div");
    progressBarValue.setAttribute("id", "progressBarValue");
    progressBar.appendChild(progressBarValue);

    elements.progressBar = progressBar;
    elements.progressBarValue = progressBarValue;
    elements.progressBarContainer.appendChild(elements.progressBar);
  } else {
    var progressBar = document.createElement("progress");
    progressBar.setAttribute("id", "progressBar");
    progressBar.max = settings.maxValue;

    elements.progressBar = progressBar;
    elements.progressBarContainer.appendChild(elements.progressBar);
  }

  // apply classes
  elements.text.classList.add(...settings.classes.text);
  elements.detail.classList.add(...settings.classes.detail);
  elements.text.classList.add(...settings.classes.text);
  elements.progressBar.classList.add(...settings.classes.bar);
  if (settings.indeterminate)
    elements.progressBarValue.classList.add(...settings.classes.value);

  window.requestAnimationFrame(synchronizeUi);
}

function synchronizeUi() {
  elements.progressBar.value = currentValue.progress;
  elements.text.innerHTML = currentValue.text;
  elements.detail.innerHTML = currentValue.detail;
  window.requestAnimationFrame(synchronizeUi);
}

window.ipcRenderer.on("CREATE_PROGRESS_BAR", (event, settings) => {
  createProgressBar(settings);
});

window.ipcRenderer.on("SET_PROGRESS", (event, value) => {
  currentValue.progress = value;
});

window.ipcRenderer.on("SET_COMPLETED", event => {
  elements.progressBar.classList.add("completed");
});

window.ipcRenderer.on("SET_TEXT", (event, value) => {
  currentValue.text = value;
});

window.ipcRenderer.on("SET_DETAIL", (event, value) => {
  currentValue.detail = value;
});
