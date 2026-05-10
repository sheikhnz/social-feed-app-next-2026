import type { FormProps } from "antd";

/**
 * Default horizontal form layout for medium+ viewports; reuse for consistent admin-style forms.
 */
export const APP_FORM_LAYOUT: Pick<FormProps, "layout" | "labelCol" | "wrapperCol"> =
  {
    layout: "horizontal",
    labelCol: { xs: { span: 24 }, sm: { span: 8 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
  };

/**
 * Full-width stacked fields on every breakpoint (sign-in flows, drawers, modals).
 */
export const APP_FORM_LAYOUT_VERTICAL_FULL: Pick<
  FormProps,
  "layout" | "labelCol" | "wrapperCol"
> = {
  layout: "vertical",
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
