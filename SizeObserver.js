import React from "react";
import ReactDOM from "react-dom";
//import styled from "react-emotion";
//import cuid from "cuid";

/*
const Label = styled("div")({
  position: "fixed",
  background: "rgba(0,0,0,0.5)",
  color: "#fff",
  padding: 8,
  zIndex: 100,
  "*": {
    margin: 0
  }
});
*/


class SizeObserver extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.name /* || cuid() */;
    this.mountNode = document.getElementById("root");
  }

  componentDidMount() {
    this.intervalUpdate = setInterval(this.updatePosition, 50);
  }

  componentWillUnmount() {
    clearInterval(this.intervalUpdate);
  }

  updatePosition = () => {
    this.forceUpdate();
  };

   getBound() {
      console.log("id = ", this.id);
      const component = document.getElementById(this.id);
      console.log("component = ", component);
      if (!component) {
         return {};
      }
      const rect = component.getBoundingClientRect();
      console.log("rect = ", rect);

//      console.log('window.scrollY', window.scrollY)
      return {
         left: rect.left,
         top: rect.top + window.scrollY,
         width: rect.width || rect.right - rect.left,
         height: rect.height || rect.bottom - rect.top
      };
   }

/*
        {ReactDOM.createPortal(
          <Label
            style={{
              top: bound.top,
              left: bound.left
            }}
          >
            <p>w: {bound.width}</p>
            <p>h: {bound.height}</p>
          </Label>,
          this.mountNode
        )}
        {this.props.children(this.id)}

*/


  render() {
    const bound = this.getBound();
    return (
      <React.Fragment>
         <div>
         <p>w: {bound.width}</p>
         <p>h: {bound.height}</p>
         </div>
      </React.Fragment>
    );
  }
}

export default SizeObserver;
