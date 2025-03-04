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
// this creates a fiber for each eleemnt of the react and assigns it as 1 uit of work//

function createDom(fiber) {
  //if it is a text, then first make it an object//

  const dom =
    fiber.type == "text"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

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

  return dom;
}

//this is so as to recursively call the fiber to append to dom//

function commitRoot(){
   commitWork(wipRoot.child);
   wipRoot = null
}
function commitWork(fiber){
  if (!fiber){
    return
  }
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

//set the work unit to the root of the fiber//
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };
  nextUnitOfWOrk = wip
}
// here the main thread is being block unntil the whole code has run, so we break the code in small chunks//

let nextUnitOfWOrk = null;
let wipRoot = null;

function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWOrk && !shouldYield) {
    nextUnitOfWOrk = performUnitOfWork(nextUnitOfWOrk);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if(!nextUnitOfWOrk && wipRoot){
    commitRoot()
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);


// to orgaize the code into chuks, we nedd to make them into fibres//


function performUnitOfWork(fiber) {
  //checks if the fiber has a parent, if it does than add the fiber to its parent//

  if(!fiber){
    createDom(fiber)
  }
  
  //add fibers child to tha fiber dom//

  const elements = fiber.props.children;
  let prevSibling = null;
  
  for(let i = 0; i < elements.length; i++){
    const element = elements[i];

    const newFiber = {
      type : element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    }

    if(i === 0){
      fiber.child = newFiber
    }
    else{
      prevSibling.sibling = newFiber
    }

    prevSibling =newFiber
  }
  //now we find the next unit of work//

  if(fiber.child){
    return fiber.child
  }
  nextFiber = fiber;
  while(nextFiber){

    if(nextFiber.sibling){

      return nextFiber.sibling
    }
    nextFiber = fiber.parent;
  }
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
