import vue from "eslint-plugin-vue";
import tailwind from "eslint-plugin-tailwindcss";

export default [
  ...vue.configs["flat/recommended"],
  ...tailwind.configs["flat/recommended"],
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "tailwindcss/classnames-order": "warn",
    },
  },
];
