/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Positioner, Placements } from "./Positions";
import { ReferenceChildrenProps } from "react-popper";
import { Text } from "./Text";
import theme from "./Theme";
import { animated } from "react-spring";

interface TooltipProps {
  content: React.ReactNode;
  placement?: Placements;
  children: React.ReactElement<any>;
}

let idcount = 0;

export function Tooltip({ placement, children, content }: TooltipProps) {
  const [show, setShow] = React.useState(false);
  const [id] = React.useState(() => idcount.toString());

  React.useEffect(() => {
    idcount += 1;
  }, []);

  function renderTrigger({ ref }: ReferenceChildrenProps) {
    return React.cloneElement(children, {
      ref,
      "aria-describedby": id,
      onMouseEnter: (e: MouseEvent) => {
        if (!show) setShow(true);
      },
      onMouseLeave: (e: MouseEvent) => {
        if (show) setShow(false);
      },
      onFocus: (e: FocusEvent) => {
        if (!show) setShow(true);
      },
      onBlur: (e: FocusEvent) => {
        if (show) setShow(false);
      }
    });
  }

  return (
    <Positioner
      placement={placement}
      show={show}
      duration={200}
      target={renderTrigger}
    >
      {({ placement, ref, style, arrowProps }, state) => (
        <animated.div
          id={id}
          data-placement={placement}
          role="tooltip"
          ref={ref}
          style={{
            ...style,
            opacity: state.opacity
          }}
          css={{
            margin: theme.spaces.xs
          }}
        >
          <div
            data-placement={placement}
            css={arrowStyles(theme.colors.palette.neutral.dark)}
            ref={arrowProps.ref}
            style={arrowProps.style}
          />
          <Text
            variant="body"
            css={[
              {
                fontSize: theme.sizes[0],
                display: "inline-block",
                margin: 0,
                boxShadow: theme.shadows.md,
                borderRadius: theme.radii.sm,
                padding: `${theme.spaces.xs} ${theme.spaces.md}`,
                color: "white",
                background: theme.colors.palette.neutral.dark
              }
            ]}
          >
            {content}
          </Text>
        </animated.div>
      )}
    </Positioner>
  );
}

export const arrowStyles = (color: string) =>
  css(`
  position: absolute;
  width: 3em;
  height: 3em;
  &[data-placement*='bottom'] {
    bottom: 100%;
    left: 0;
    margin-top: 0em;
    width: 1em;
    height: 0.25em;
    &::before {
      border-width: 0 0.25em 0.25em 0.25em;
      border-color: transparent transparent ${color} transparent;
    }
  }
  &[data-placement*='top'] {
    top: 100%;
    left: 0;
    margin-bottom: 0;
    width: 1em;
    height: 0.25em;
    &::before {
      border-width: 0.25em 0.25em 0 0.25em;
      border-color: ${color} transparent transparent transparent;
    }
  }
  &[data-placement*='right'] {
    right: 100%;
    height: 1em;
    width: 0.25em;
    &::before {
      border-width: 0.25em 0.25em 0.25em 0;
      border-color: transparent ${color} transparent transparent;
    }
  }
  &[data-placement*='left'] {
    left: 100%;
    height: 1em;
    width: 0.25em;
    &::before {
      border-width: 0.25em 0 0.25em 0.25em;
      border-color: transparent transparent transparent ${color};
    }
  }
  &::before {
    content: '';
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
  }
`);
