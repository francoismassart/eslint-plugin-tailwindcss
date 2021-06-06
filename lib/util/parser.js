function defineTemplateBodyVisitor(context, templateBodyVisitor, scriptVisitor) {
  if (context.parserServices == null || context.parserServices.defineTemplateBodyVisitor == null) {
    return scriptVisitor;
  }

  return context.parserServices.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor);
}

module.exports = {
  defineTemplateBodyVisitor,
};
