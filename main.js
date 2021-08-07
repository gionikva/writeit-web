window.addEventListener("load", function() {
    const result = bowser.getParser(navigator.userAgent).getResult();
    if (result.browser.name === 'Safari' || result.browser.name === 'Internet Explorer') {
        document.getElementById("demo").innerHTML = `Add to Chrome`; // Safari + IE can't have extensions like this so default to chrome
    } else if (isBrave()) {
        document.getElementById("demo").innerHTML = `Add to Brave`;
    } else {
        document.getElementById("demo").innerHTML = `Add to ${result.browser.name}`;
    }
})

function isBrave() {
    if (window.navigator.brave != undefined) {
      if (window.navigator.brave.isBrave.name == "isBrave") {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

// brb water time 👍