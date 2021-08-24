export default {
  beforeMount(el, binding) {
    // insert icon before element is inserted
    let iconClass = `fa fa-${binding.value} text-xl`;

    // use argument full to call a different override of the iconClass equal
    // to exactly the binding's value
    if (binding.arg === 'full') {
      iconClass = binding.value;
    }

    if (binding.modifiers.right) {
      iconClass += ` float-right`;
    }

    if (binding.modifiers.yellow) {
      iconClass += ` text-yellow-400`;
    } else {
      iconClass += ` text-green-400`;
    }

    // eslint-disable-next-line no-param-reassign
    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
};
