export default {
  options(h, conf, key) {
    const list = [];
    conf.__slot__.options.forEach(item => {
      if (conf.__config__.optionType === "button") {
        list.push(
          <c-checkbox-button label={item.value}>{item.label}</c-checkbox-button>
        );
      } else {
        list.push(
          <c-checkbox label={item.value} border={conf.border}>
            {item.label}
          </c-checkbox>
        );
      }
    });
    return list;
  }
};
