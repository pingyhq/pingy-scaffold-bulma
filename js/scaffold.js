// The following code is based off a toggle menu by @Bradcomp
// source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
(function() {
  var closeButtons = document.querySelectorAll(
    "[data-close-modal], .modal-background"
  );
  var scaffoldModal = document.querySelector("#modal-scaffold");
  var finishModal = document.querySelector("#modal-finish");
  var scaffoldButtons = document.querySelectorAll("[data-scaffold]");
  var previewButtons = document.querySelectorAll("[data-preview]");
  var doScaffoldForm = document.querySelector("#do-scaffold");
  var templateName = document.querySelector("#template-name");
  var styleFormat = document.querySelector("#style-format");
  var fileName = document.querySelector("#file-name");
  var nodeSassVersion = "^4.5.3";

  var defaultPaths = {
    bulmaCSSPath: "/dist/css/bulma.css",
    fontAwesomePath: "/dist/css/font-awesome.min.css"
  };

  var defaultPathsModules = {
    bulmaCSSPath: "/node_modules/bulma/css/bulma.css",
    bulmaSassPath: "node_modules/bulma/bulma.sass",
    fontAwesomePath: "/node_modules/font-awesome/css/font-awesome.css"
  };

  [].forEach.call(scaffoldButtons, function(btn) {
    btn.addEventListener("click", showScaffoldModal);
  });

  [].forEach.call(previewButtons, function(btn) {
    btn.addEventListener("click", preview);
  });

  [].forEach.call(closeButtons, function(btn) {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      scaffoldModal.classList.remove("is-active");
    });
  });

  doScaffoldForm.addEventListener(
    "submit",
    function(e) {
      e.preventDefault();
      scaffold();
    },
    false
  );

  function getFolderNameFromEl(el) {
    const href = el.href;
    const folderName = href
      .split("templates/")[1]
      .split("/")[0]
      .split(".html")[0];
    return folderName;
  }

  const contains = (arr, name) => arr.filter(x => x === name).length;
  const hasCustomCSS = name => !contains(["cover", "skeleton"], name);
  function showScaffoldModal(e) {
    e.preventDefault();
    const el = e.target;
    const folderName = getFolderNameFromEl(el);
    templateName.value = folderName;
    fileName.value = "index.html";
    scaffoldModal.classList.add("is-active");
  }

  function hideScaffoldModal() {
    scaffoldModal.classList.remove("is-active");
  }

  function showFinishModal() {
    finishModal.classList.add("is-active");
  }

  function preview(e) {
    e.preventDefault();
    const el = e.currentTarget;
    const folderName = getFolderNameFromEl(el);
    const vars = Object.assign(
      {
        customCSSPath: "/css/" + folderName + ".css"
      },
      defaultPaths
    );
    window.open(pingy.templatedURL(el.href, vars), "_blank");
  }

  function scaffold() {
    const folderName = templateName.value;

    const vars = Object.assign({}, defaultPathsModules);
    const files = [];
    const devDependencies = {};

    if (styleFormat.value === "scss") {
      devDependencies["node-sass"] = nodeSassVersion;
    }

    if (hasCustomCSS(folderName)) {
      const cssPath = "styles/main.css";

      if (styleFormat.value === "scss") {
        devDependencies["node-sass"] = nodeSassVersion;
        files.push({
          input: "templates/template.scss",
          includes: {
            customCSS: "css/" + folderName + ".css"
          },
          vars: {
            bulmaSassPath: defaultPathsModules.bulmaSassPath
          },
          output: "styles/main.scss"
        });
        vars.bulmaCSSPath = cssPath;
      } else {
        vars.customCSSPath = cssPath;
        files.push({
          input: "css/" + folderName + ".css",
          output: cssPath
        });
      }
    }

    files.push({
      input: "templates/" + folderName + ".html",
      output: document.querySelector("#file-name").value,
      vars
    });

    pingy.scaffold({ files, devDependencies }).then(() => {
      hideScaffoldModal();
      showFinishModal();
      window.addEventListener("blur", () => window.close());
    });
  }
})();
