import type { Meta, StoryObj } from "@storybook/react";
import TextFieldComponent from "./TextFieldComponent";

const meta: Meta<typeof TextFieldComponent> = {
  title: "Components/TextField",
  component: TextFieldComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "password", "email", "number"],
    },
    disabled: {
      control: "boolean",
    },
    fullWidth: {
      control: "boolean",
    },
    readOnly: {
      control: "boolean",
    },
    helperText: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextFieldComponent>;

export const Default: Story = {
  args: {
    label: "Default Input",
    placeholder: "Enter text here",
    onChange: (e) => console.log("Changed:", e.target.value),
  },
};

export const WithError: Story = {
  args: {
    label: "Input with Error",
    placeholder: "Enter text here",
    errorText: "This field is required",
    touched: true,
    helperText: true,
    onChange: (e) => console.log("Changed:", e.target.value),
  },
};

export const WithButton: Story = {
  args: {
    label: "Input with Button",
    placeholder: "Enter text here",
    buttonProps: {
      text: "Submit",
      onClick: () => console.log("Button clicked"),
      width: "100px",
    },
    onChange: (e) => console.log("Changed:", e.target.value),
  },
};

export const Password: Story = {
  args: {
    label: "Password Input",
    type: "password",
    placeholder: "Enter password",
    onChange: (e) => console.log("Changed:", e.target.value),
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Input",
    placeholder: "This input is disabled",
    disabled: true,
    onChange: (e) => console.log("Changed:", e.target.value),
  },
};

export const FullWidth: Story = {
  args: {
    label: "Full Width Input",
    placeholder: "This input takes full width",
    fullWidth: true,
    onChange: (e) => console.log("Changed:", e.target.value),
  },
};
