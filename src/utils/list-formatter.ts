export const joinListElements = (
  elements: Array<string>,
  separator: string = ", ",
  conjunction: string = "or",
) => {
  if (elements.length === 0) return "";
  if (elements.length === 1) return elements[0];
  if (elements.length === 2)
    return `${elements[0]} ${conjunction} ${elements[1]}`;
  const last = elements.pop();
  return `${elements.join(separator)} ${conjunction} ${last}`;
};
