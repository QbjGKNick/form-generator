/* eslint-disable */
export const load = src => {
  function stdOnEnd(script, resolve, reject) {
    script.onload = function() {
      // this.onload = null here is necessary
      // because even IE9 works not like others
      this.onerror = this.onload = null;
      resolve();
    };
    script.onerror = function() {
      this.onerror = this.onload = null;
      reject();
    };
  }

  function ieOnEnd(script, resolve) {
    script.onreadystatechange = function() {
      if (this.readyState !== "complete" && this.readyState !== "loaded") {
        return;
      }
      this.onreadystatechange = null;
      resolve();
    };
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(src);

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = src; // src url for the third-party library being loaded.
      script.id = src;
      document.body.appendChild(script);

      const onEnd = "onload" in script ? stdOnEnd : ieOnEnd;
      onEnd(script, resolve, reject);
    } else {
      resolve();
    }
  });
};

export const loadCss = src => {
  return new Promise(resolve => {
    const existingCss = document.getElementById(src);

    if (!existingCss) {
      const link = document.createElement("link");
      link.href = src; // src url for the third-party library being loaded.
      link.id = src;
      link.rel = "stylesheet";
      document.head.appendChild(link);
      resolve();
    } else {
      resolve();
    }
  });
};
