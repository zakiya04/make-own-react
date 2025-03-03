// this is how the main React.createElement actually is//
const element = {
    type : 'h1',
    props : {
      title : 'foo',
      children :"Hello!"
    }
  }
  
  // the Raect.render places it in the dom but we will make our own//
  const node = document.createElement(element.type);
  node['title'] = element.props.title;
  
  const text = document.createTextNode("");
  text['nodeValue']= element.props.children;
  
  //our render component is ready, now we need to get the main div from where we can append the element into //
  
  const conatiner = document.getElementById('root')
  //we now append our child to the main div to see the desired changes //
  
  node.appendChild(text);
  conatiner.appendChild(node);