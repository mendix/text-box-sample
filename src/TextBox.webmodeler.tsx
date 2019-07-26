import { Component, ReactNode, createElement } from "react";
import { TextBoxPreviewProps, VisibilityMap } from "../typings/TextBoxProps";
import { TextInput } from "./components/TextInput";

declare function require(name: string): string;

export class preview extends Component<TextBoxPreviewProps> {
    render(): ReactNode {
        const value = `[${this.props.textAttribute}]`;
        return <TextInput value={value} disabled={this.props.editable === "never"} />;
    }
}

export function getVisibleProperties(_valueMap: TextBoxPreviewProps, visibilityMap: VisibilityMap): VisibilityMap {
    /* To hide any property in Mendix Studio, please assign the property in visibilityMap to false */
    return visibilityMap;
}

export function getPreviewCss(): string {
    return require("./ui/TextBox.css");
}
