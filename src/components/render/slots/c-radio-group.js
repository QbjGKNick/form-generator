export default {
  options(h, conf, key) {
    const list = [];
    conf.__slot__.options.forEach(item => {
      if (conf.__config__.optionType === "button") {
        list.push(
          <c-radio-button label={item.value}>{item.label}</c-radio-button>
        );
      } else {
        list.push(
          <c-radio label={item.value} border={conf.border}>
            {item.label}
          </c-radio>
        );
      }
    });
    return list;
  }
};
