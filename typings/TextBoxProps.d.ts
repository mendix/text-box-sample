/**
 * This file was generated from TextBox.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Team
 */
import { CSSProperties } from "react";
import { ActionPreview } from "@mendix/pluggable-widgets-typing-generator/dist/typings";
import { ActionValue, DynamicValue, EditableValue } from "mendix";

interface CommonProps {
    id: string;
    class: string;
    style?: CSSProperties;
    tabIndex: number;
}

export interface TextBoxContainerProps extends CommonProps {
    textAttribute: EditableValue<string>;
    requiredMessage?: DynamicValue<string>;
    onChangeAction?: ActionValue;
}

export interface TextBoxPreviewProps extends CommonProps {
    textAttribute: string;
    requiredMessage?: string;
    onChangeAction?: ActionPreview;
}

export interface VisibilityMap {
    textAttribute: boolean;
    requiredMessage: boolean;
    onChangeAction: boolean;
}
