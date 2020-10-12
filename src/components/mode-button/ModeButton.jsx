import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  checkedIcon as defaultCheckedIcon,
  uncheckedIcon as defaultUncheckedIcon
} from "./icons.jsx";
import getBackgroundColor from "./getBackgroundColor";
import hexColorPropType from "./hexColorPropType";

class ModeButton extends Component {
  constructor(props) {
    super(props);
    const { height, width, handleDiameter, checked } = props;
    this.$handleDiameter = handleDiameter || height - 4;
    this.$checkedPos = (width - 4) / 2;
    this.$uncheckedPos = Math.max(0, (height - this.$handleDiameter) / 2);
    this.state = {
      $pos: checked ? this.$checkedPos : this.$uncheckedPos,
      handleText: !checked ? props.checkedText : props.uncheckedText
    };

    this.$lastDragAt = 0;
    this.$lastKeyUpAt = 0;

    this.$onMouseDown = this.$onMouseDown.bind(this);
    this.$onMouseMove = this.$onMouseMove.bind(this);
    this.$onMouseUp = this.$onMouseUp.bind(this);

    this.$onTouchStart = this.$onTouchStart.bind(this);
    this.$onTouchMove = this.$onTouchMove.bind(this);
    this.$onTouchEnd = this.$onTouchEnd.bind(this);
    this.$onClick = this.$onClick.bind(this);

    this.$onInputChange = this.$onInputChange.bind(this);
    this.$onKeyUp = this.$onKeyUp.bind(this);
    this.$setHasOutline = this.$setHasOutline.bind(this);
    this.$unsetHasOutline = this.$unsetHasOutline.bind(this);
    this.$getInputRef = this.$getInputRef.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.checked === this.props.checked) {
      return;
    }

    const $pos = this.props.checked ? this.$checkedPos : this.$uncheckedPos;
    this.setState({ $pos });

    this.setState({handleText: !this.props.checked ? this.props.checkedText : this.props.uncheckedText});
  }

  $onDragStart(clientX) {
    this.$inputRef.focus();
    this.setState({
      $startX: clientX,
      $hasOutline: true,
      $dragStartingTime: Date.now()
    });
  }

  $onDrag(clientX) {
    const { $startX, $isDragging, $pos } = this.state;
    const { checked } = this.props;
    const startPos = checked ? this.$checkedPos : this.$uncheckedPos;
    const mousePos = startPos + clientX - $startX;
    // We need this check to fix a windows glitch where onDrag is triggered onMouseDown in some cases
    if (!$isDragging && clientX !== $startX) {
      this.setState({ $isDragging: true });
    }
    const newPos = Math.min(
      this.$checkedPos,
      Math.max(this.$uncheckedPos, mousePos)
    );
    // Prevent unnecessary rerenders
    if (newPos !== $pos) {
      this.setState({ $pos: newPos });
    }
  }

  $onDragStop(event) {
    const { $pos, $isDragging, $dragStartingTime } = this.state;
    const { checked } = this.props;
    const halfwayCheckpoint = (this.$checkedPos + this.$uncheckedPos) / 2;

    // Simulate clicking the handle
    const timeSinceStart = Date.now() - $dragStartingTime;
    if (!$isDragging || timeSinceStart < 250) {
      this.$onChange(event);

      // Handle dragging from checked position
    } else if (checked) {
      if ($pos > halfwayCheckpoint) {
        this.setState({ $pos: this.$checkedPos });
      } else {
        this.$onChange(event);
      }
      // Handle dragging from unchecked position
    } else if ($pos < halfwayCheckpoint) {
      this.setState({ $pos: this.$uncheckedPos });
    } else {
      this.$onChange(event);
    }

    this.setState({ $isDragging: false, $hasOutline: false });
    this.$lastDragAt = Date.now();
  }

  $onMouseDown(event) {
    event.preventDefault();
    // Ignore right click and scroll
    if (typeof event.button === "number" && event.button !== 0) {
      return;
    }

    this.$onDragStart(event.clientX);
    window.addEventListener("mousemove", this.$onMouseMove);
    window.addEventListener("mouseup", this.$onMouseUp);
  }

  $onMouseMove(event) {
    event.preventDefault();
    this.$onDrag(event.clientX);
  }

  $onMouseUp(event) {
    this.$onDragStop(event);
    window.removeEventListener("mousemove", this.$onMouseMove);
    window.removeEventListener("mouseup", this.$onMouseUp);
  }

  $onTouchStart(event) {
    this.$checkedStateFromDragging = null;
    this.$onDragStart(event.touches[0].clientX);
  }

  $onTouchMove(event) {
    this.$onDrag(event.touches[0].clientX);
  }

  $onTouchEnd(event) {
    event.preventDefault();
    this.$onDragStop(event);
  }

  $onInputChange(event) {
    // This condition is unfortunately needed in some browsers where the input's change event might get triggered
    // right after the dragstop event is triggered (occurs when dropping over a label element)
    if (Date.now() - this.$lastDragAt > 50) {
      this.$onChange(event);
      // Prevent clicking label, but not key activation from setting outline to true - yes, this is absurd
      if (Date.now() - this.$lastKeyUpAt > 50) {
        this.setState({ $hasOutline: false });
      }
    }
  }

  $onKeyUp() {
    this.$lastKeyUpAt = Date.now();
  }

  $setHasOutline() {
    this.setState({ $hasOutline: true });
  }

  $unsetHasOutline() {
    this.setState({ $hasOutline: false });
  }

  $getInputRef(el) {
    this.$inputRef = el;
  }

  $onClick(event) {
    event.preventDefault();
    this.$inputRef.focus();
    this.$onChange(event);
    this.setState({ $hasOutline: false });
  }

  $onChange(event) {
    const { checked, onChange, id } = this.props;
    onChange(!checked, event, id);
  }

  render() {
    const {
      disabled,
      className,
      offColor,
      onColor,
      offHandleColor,
      onHandleColor,
      checkedText,
      uncheckedText,
      boxShadow,
      activeBoxShadow,
      height,
      width,
      handleDiameter, // just to filter this prop out
      ...rest
    } = this.props;

    const { $pos, $isDragging, $hasOutline } = this.state;

    const rootStyle = {
      position: "relative",
      display: "inline-block",
      textAlign: "left",
      opacity: disabled ? 0.5 : 1,
      direction: "ltr",
      borderRadius: Math.max(2, height * 0.1),
      WebkitTransition: "opacity 0.25s",
      MozTransition: "opacity 0.25s",
      transition: "opacity 0.25s",
      touchAction: "none",
      WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
      WebkitUserSelect: "none",
      MozUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none"
    };

    const backgroundStyle = {
      height,
      width,
      margin: Math.max(0, (this.$handleDiameter - height) / 2),
      position: "relative",
      background: getBackgroundColor(
        $pos,
        this.$checkedPos,
        this.$uncheckedPos,
        offColor,
        onColor
      ),
      boxShadow:'inset 1px 1px 0px rgba(0, 0, 0, 0.4), inset -1px -1px 0px rgba(255, 255, 255, 0.4)',
      borderRadius: Math.max(2, height * 0.1),
      cursor: disabled ? "default" : "pointer",
      WebkitTransition: $isDragging ? null : "background 0.25s",
      MozTransition: $isDragging ? null : "background 0.25s",
      transition: $isDragging ? null : "background 0.25s"
    };

    const checkedIconStyle = {
      height,
      width: Math.min(
        height * 15, //height * 1.5,
        (width - 4) / 2
      ),
      position: "relative",
      opacity:
        ($pos - this.$uncheckedPos) / (this.$checkedPos - this.$uncheckedPos),
      pointerEvents: "none",
      WebkitTransition: $isDragging ? null : "opacity 0.25s",
      MozTransition: $isDragging ? null : "opacity 0.25s",
      transition: $isDragging ? null : "opacity 0.25s"
    };

    const uncheckedIconStyle = {
      height,
      width: Math.min(
        height * 15, //height * 1.5,
        (width - 4) / 2
      ),
      position: "absolute",
      opacity:
        1 -
        ($pos - this.$uncheckedPos) / (this.$checkedPos - this.$uncheckedPos),
      right: 0,
      top: 0,
      pointerEvents: "none",
      WebkitTransition: $isDragging ? null : "opacity 0.25s",
      MozTransition: $isDragging ? null : "opacity 0.25s",
      transition: $isDragging ? null : "opacity 0.25s"
    };

    const handleStyle = {
      height: this.$handleDiameter,
      width: (width - 4) / 2,
      background: getBackgroundColor(
        $pos,
        this.$checkedPos,
        this.$uncheckedPos,
        offHandleColor,
        onHandleColor
      ),
      display: "inline-block",
      cursor: disabled ? "default" : "pointer",
      borderRadius: Math.max(2, height * 0.1),
      position: "absolute",
      transform: `translateX(${$pos}px)`,
      top: Math.max(0, (height - this.$handleDiameter) / 2),
      outline: 0,
      boxShadow: $hasOutline ? activeBoxShadow : boxShadow,
      border: 0,
      WebkitTransition: $isDragging
        ? null
        : "background-color 0.25s, transform 0.25s, box-shadow 0.15s",
      MozTransition: $isDragging
        ? null
        : "background-color 0.25s, transform 0.25s, box-shadow 0.15s",
      transition: $isDragging
        ? null
        : "background-color 0.25s, transform 0.25s, box-shadow 0.15s"
    };

    const inputStyle = {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      width: 1
    };

    return (
      <div className={className} style={rootStyle}>
        <div
          className="react-switch-bg"
          style={backgroundStyle}
          onClick={disabled ? null : this.$onClick}
          onMouseDown={e => e.preventDefault()}
        >
          <div style={checkedIconStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontSize: 15,
                color: 'white',
                paddingRight: 2
              }}
            >
              {this.props.checkedText}
            </div>
          </div>

          <div style={uncheckedIconStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontSize: 15,
                color: "white",
                paddingRight: 2
              }}
            >
              {this.props.uncheckedText}
            </div>
          </div>

        </div>
        <div
          className="react-switch-handle"
          style={handleStyle}
          onClick={e => e.preventDefault()}
          onMouseDown={disabled ? null : this.$onMouseDown}
          onTouchStart={disabled ? null : this.$onTouchStart}
          onTouchMove={disabled ? null : this.$onTouchMove}
          onTouchEnd={disabled ? null : this.$onTouchEnd}
          onTouchCancel={disabled ? null : this.$unsetHasOutline}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              fontSize: 15,
              color: '#4C97FF',
              paddingRight: 2
            }}
          >
            {this.state.handleText}
          </div>
        </div>
        <input
          type="checkbox"
          role="switch"
          disabled={disabled}
          style={inputStyle}
          {...rest}
          /* anything below should NOT get overriden by ...rest */
          ref={this.$getInputRef}
          onFocus={this.$setHasOutline}
          onBlur={this.$unsetHasOutline}
          onKeyUp={this.$onKeyUp}
          onChange={this.$onInputChange}
        />
      </div>
    );
  }
}
ModeButton.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  offColor: hexColorPropType,
  onColor: hexColorPropType,
  offHandleColor: hexColorPropType,
  onHandleColor: hexColorPropType,
  handleDiameter: PropTypes.number,
  uncheckedText: PropTypes.string,
  checkedText: PropTypes.string,
  boxShadow: PropTypes.string,
  activeBoxShadow: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  id: PropTypes.string,
  className: PropTypes.string
};

ModeButton.defaultProps = {
  disabled: false,
  offColor:"#4C97FF",
  onColor:"#4C97FF",
  offHandleColor: "#fff",
  onHandleColor: "#fff",
  uncheckedText: '在线模式',
  checkedText: '下载模式',
  boxShadow: null,
  activeBoxShadow: "0 0 2px 3px #3bf",
  height: 28,
  width: 56
};

export default ModeButton;
