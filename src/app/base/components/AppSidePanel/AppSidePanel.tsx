import { useEffect, type ReactNode } from "react";

import {
  Col,
  Row,
  useOnEscapePressed,
  usePrevious,
} from "@canonical/react-components";
import classNames from "classnames";
import { useLocation } from "react-router-dom-v5-compat";

import type { SidePanelSize } from "app/base/side-panel-context";
import { useSidePanel } from "app/base/side-panel-context";

export type AppSidePanelProps = {
  title: string | null;
  content?: ReactNode;
  size: SidePanelSize;
};

const useCloseSidePanelOnRouteChange = (): void => {
  const { setSidePanelContent } = useSidePanel();
  const { pathname } = useLocation();
  const previousPathname = usePrevious(pathname);

  // close side panel on route change
  useEffect(() => {
    if (pathname !== previousPathname) {
      setSidePanelContent(null);
    }
  }, [pathname, previousPathname, setSidePanelContent]);
};

const useResetSidePanelOnUnmount = (): void => {
  const { setSidePanelSize } = useSidePanel();

  // reset side panel size to default on unmount
  useEffect(() => {
    return () => {
      setSidePanelSize("regular");
    };
  }, [setSidePanelSize]);
};

const useCloseSidePanelOnEscPressed = (): void => {
  const { setSidePanelContent } = useSidePanel();
  useOnEscapePressed(() => setSidePanelContent(null));
};

const AppSidePanelContent = ({
  title,
  size,
  content,
}: AppSidePanelProps): JSX.Element => {
  return (
    <aside
      aria-label={title ?? undefined}
      className={classNames("l-aside", {
        "is-collapsed": !content,
        "is-narrow": size === "narrow",
        "is-large": size === "large",
        "is-wide": size === "wide",
      })}
      data-testid="section-header-content"
      id="aside-panel"
    >
      <Row>
        <Col size={12}>
          {title ? (
            <div className="row section-header">
              <div className="col-12">
                <h3 className="section-header__title u-flex--no-shrink p-heading--4">
                  {title}
                </h3>
                <hr />
              </div>
            </div>
          ) : null}
          {content}
        </Col>
      </Row>
    </aside>
  );
};

const AppSidePanel = (props: Omit<AppSidePanelProps, "size">): JSX.Element => {
  useCloseSidePanelOnEscPressed();
  useCloseSidePanelOnRouteChange();
  useResetSidePanelOnUnmount();
  const { sidePanelSize } = useSidePanel();

  return <AppSidePanelContent {...props} size={sidePanelSize} />;
};

export default AppSidePanel;
