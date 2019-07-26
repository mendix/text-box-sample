/**
 * This file was generated from TextBox.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Team
 */
import { CSSProperties } from "react";
import { pages } from "mendixmodelsdk";
import { ActionValue, DynamicValue, EditableValue } from "mendix";

interface CommonProps {
    id: string;
    class: string;
    style?: CSSProperties;
    tabIndex: number;
}

export type EditableEnum = "default" | "never";

export interface TextBoxContainerProps extends CommonProps {
    textAttribute: EditableValue<string>;
    editable: EditableEnum;
    requiredMessage?: DynamicValue<string>;
    onChangeAction?: ActionValue;
}

export interface TextBoxPreviewProps extends CommonProps {
    textAttribute: string;
    editable: EditableEnum;
    requiredMessage?: string;
    onChangeAction?: pages.ClientAction;
}

export interface VisibilityMap {
    textAttribute: boolean;
    editable: boolean;
    requiredMessage: boolean;
    onChangeAction: boolean;
}
