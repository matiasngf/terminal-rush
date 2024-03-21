module.exports = function (source) {
  const newSource = `
  const template = Handlebars.compile(${JSON.stringify(source)});
  const transformCode = (data) => template(data);
  export default transformCode;`
  return newSource;
}
