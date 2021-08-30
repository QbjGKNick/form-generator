export default {
  options(h, conf, key) {
    const list = [];
    conf.__slot__.options.forEach(item => {
      list.push(
        <c-option
          label={item.label}
          value={item.value}
          disabled={item.disabled}
        ></c-option>
      );
    });
    return list;
  }
};
