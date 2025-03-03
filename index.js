//now we will create our own React.createElement//

function createElement(type,props, ...children){
  return{
     type,
     props:{
      ...props,
      children: children.map(child =>
        typeof child === 'object'
        ? child : createTextElement(child)
        ),
     }
  }
}

// this function is so as to make an object out of the children that arent already one//

function createTextElement(text){
  return{
    type : 'text',
    props: {
      nodeValue : text,
      children: []
    }
  }
}
// we will create our own method name so that the code will work as babel trnaspiles the code by the Rxt //
const Rxt = {
  createElement,
}
/** @jsx Rxt.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
)