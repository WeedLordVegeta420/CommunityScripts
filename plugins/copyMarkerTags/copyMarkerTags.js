(async () => {
  while (!window.stash) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  let primaryTag = null;
  let tags = [];

  const markerButtons = 
    '<div id="markerTagButtons" style="margin-top:25px" class="buttons-container px-3"><div class="d-flex"><button type="button" id="copyTagsButton" class="btn btn-secondary">Copy Tags</button><button type="button" id="pasteTagsButton" class="ml-2 btn btn-secondary">Paste Tags</button></div></div>'

  async function setupMarkerCopyPasteButtons() {
    var markerButtonDiv = document.getElementById("markerTagButtons");

    if (markerButtonDiv == null) {
      var markersForm = document.querySelector("label[for='primary_tag_id']").closest('form');
      var newDiv = document.createElement("div");
      newDiv.innerHTML = markerButtons;
      markersForm.append(newDiv);

      document.getElementById('copyTagsButton').addEventListener("click", copyTagsClick);
      document.getElementById('pasteTagsButton').addEventListener("click", pasteTagsClick);
    }

    waitForElementByXpath("//label[@for='primary_tag_id']", setupMarkerCopyPasteButtons);
  }

  function copyTagsClick() {
    primaryTag = document.querySelector("label[for='primary_tag_id'] + div").textContent;

    var tagElements = document.querySelectorAll("label[for='tag_ids'] + div .react-select__multi-value")
    tags = Array.from(tagElements).map((x) => x.textContent);
  }

  async function pasteTagsClick() {
    var primaryTagInput = document.querySelector("label[for='primary_tag_id'] + div input");
    changeValue(primaryTagInput, primaryTag)
    while (document.querySelector(".react-select-image-option") == null) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    document.querySelector(".react-select-image-option").dispatchEvent(new Event('click', {bubbles: true}));

    var tagInput = document.querySelector("label[for='tag_ids'] + div input");
    // await Promise.all(tags.map(async (x) => {
    //   changeValue(tagInput, x)
    //   while (document.querySelector(".react-select-image-option") == null) {
    //     await new Promise((resolve) => setTimeout(resolve, 0));
    //   }
    //   document.querySelector(".react-select-image-option").dispatchEvent(new Event('click', {bubbles: true}));
    // }));

    for (let i = 0; i < tags.length; i++) {
      var x = tags[i];
      changeValue(tagInput, x)
      while (document.querySelector(".react-select-image-option") == null) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      document.querySelector(".react-select-image-option").dispatchEvent(new Event('click', {bubbles: true}));
    }

    document.querySelector("label[for='primary_tag_id']").dispatchEvent(new Event('click', {bubbles: true}));
    
  }

  function changeValue(input,value) {
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;
    nativeInputValueSetter.call(input, value);

    var inputEvent = new Event("input", { bubbles: true });
    input.dispatchEvent(inputEvent);
  }

  // Wait for video player to load on scene page.
  csLib.PathElementListener(
    "/scenes/",
    "label[for='primary_tag_id']",
    setupMarkerCopyPasteButtons
  ); // PathElementListener is from cs-ui-lib.js
})();

