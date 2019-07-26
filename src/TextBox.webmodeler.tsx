import { Component, ReactNode, createElement } from "react";
import { TextBoxWebModelerProps } from "../typings/TextBoxProps";
import { TextInput } from "./components/TextInput";

// tslint:disable-next-line class-name
export class preview extends Component<TextBoxWebModelerProps> {
    render(): ReactNode {
        const value = `[${this.props.textAttribute}]`;
        return <TextInput value={value} disabled={this.props.editable === "never"} />;
    }
}

export function getVisibleProperties(_valueMap: TextBoxPreviewProps, visibilityMap: VisibilityMap): VisibilityMap {
    /* To hide any property in Mendix Studio, please assign the property in visibilityMap to false */
    return visibilityMap;
}

