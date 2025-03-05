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

function updateDom(dom, prevProps, nextProps){
  
}

//this is so as to recursively call the fiber to append to dom//

function commitRoot(){
  deletions.forEach(commitWork)
   commitWork(wipRoot.child);
   currentRoot = wipRoot;
   wipRoot = null
}
function commitWork(fiber){
  if (!fiber){
    return
  }
  const domParent = fiber.parent.dom;

  //handles when there is a new element to be appended//
  if(fiber.effectTag === "PLACEMENT" && fiber.dom != null){
    domParent.appendChild(fiber.dom)
  }
  //handles when an element is  deleted//
  else if(fiber.effectTag === 'DELETION'){
    domParent.removeChild(fiber.dom)
  }
  // handles updates in an element//
  else if(fiber.effectTag === 'UPDATE' && fiber.dom != null){
    updateDom(fiber.dom, fiber.alternate.props, fiber.props)
  }
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
    alternate: currentRoot,
  };

  // to have the deleted item in an array//

  deletions = []
  nextUnitOfWOrk = wip
}
// here the main thread is being block unntil the whole code has run, so we break the code in small chunks//

let nextUnitOfWOrk = null;
let wipRoot = null;
let currentRoot = null;
let deletions = null;

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
  if(!fiber.dom){
    fiber.dom = createDom(fiber)
  }

  const elements = fiber.props.children;
  reconcileChilren(fiber, elements)

  if(fiber.child){
    return fiber.child
  }
  let nextFiber = fiber;

  while(nextFiber){

    if(nextFiber.sibling){

      return nextFiber.sibling
    }
    nextFiber = fiber.parent;
  }
}
// create a reconcile function//

function reconcileChilren(wipFiber,elements){  
  let index = 0
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;
    const sameType = element && oldFiber && element.type == oldFiber.type;

    //THE PROCESS OF RECONCILLIATION//

    // when old fiber and the new fiber are same //

    if(sameType){
      newFiber = {
        type: oldFiber.tpye,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE'
      }
    }

    // when the element and old fiber arent same //
    if(element && !sameType){
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT'
      }
    }
    //when oldFiber and element arent same//
    if(oldFiber && !sameType){
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber)
    }

    if(oldFiber){
      oldFiber = oldFiber.sibling
    }
    if (index === 0) {
      wipFiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
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
