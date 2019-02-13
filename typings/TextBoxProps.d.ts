/**
 * AUTO-GENERATED file: please do not change this file otherwise it will be overwritten
 * @author Mendix Widgets Team
 */
import * as React from "react";
import { pages } from "mendixmodelsdk";

interface CommonProps {
    id: string;
    class: string;
    style?: React.CSSProperties;
    tabIndex: number; 
}

export type EditableEnum = "default" | "never";

export interface TextBoxContainerProps extends CommonProps {
    textAttribute: PluginWidget.EditableValue<string>;
    editable: EditableEnum;
    requiredMessage?: PluginWidget.DynamicValue<string>;
    onChangeAction?: PluginWidget.ActionValue;
}

export interface TextBoxWebModelerProps extends CommonProps {
    textAttribute: string;
    editable: EditableEnum;
    requiredMessage?: string;
    onChangeAction?: pages.ClientAction;
}

export interface VisibilityMap {
    textAttribute: boolean
    editable: boolean
    requiredMessage: boolean
    onChangeAction: boolean
}
