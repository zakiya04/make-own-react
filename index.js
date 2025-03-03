//now we will create our own React.createElement//

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// this function is so as to make an object out of the children that arent already one//

function createTextElement(text) {
  return {
    type: "text",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
// we will create a dom node for each child and append it to the container//

function render(element, container) {
  //if it is a text, then first make it an object//

  const dom =
    element.type == "text"
      ? createTextElement(element)
      : document.createElement(element.type);

  //properties of the element to be given to node//

  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  element.props.children.forEach((child) => {
    //recursive fuction//
    render(child, dom);
  });

  container.appendChild(dom);
}

// we will create our own method name so that the code will work as babel trnaspiles the code by the Rxt //
const Rxt = {
  createElement,
  render,
};
/** @jsx Rxt.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);

const container = document.getElementById("root");
Rxt.render(element, container);
