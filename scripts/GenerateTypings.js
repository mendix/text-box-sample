"use strict";
const PluginError = require("plugin-error");

const translateType = (prop, childTypes, webmodeler = false) => {
    switch (prop.$.type) {
        case "attribute":
            if (!prop.attributeTypes || prop.attributeTypes.length === 0) {
                throw new PluginError("Typing generation", {
                    message: "[XML] Attribute property requires attributeTypes element"
                });
            }
            return webmodeler
                ? findTypes(prop.attributeTypes[0])
                : `PluginWidget.EditableValue<${findTypes(prop.attributeTypes[0])}>`;
        case "action":
            return webmodeler ? "pages.ClientAction" : "PluginWidget.ActionValue";
        case "textTemplate":
            return webmodeler ? "string" : "PluginWidget.DynamicValue<string>";
        case "integer":
            return "number";
        case "enumeration":
            return generateEnums(prop, !webmodeler ? childTypes: []);
        case "object":
            if (prop.$.hasOwnProperty("isList")) {
                if (prop.$.isList) {
                    return `${generateChildProps(prop, childTypes, webmodeler)}[]`;
                }
            }
            return "any";
    }
    return prop.$.type;
};

const generateEnums = (prop, childTypes) => {
    if (
        !prop.enumerationValues ||
        prop.enumerationValues.length === 0 ||
        !prop.enumerationValues[0].enumerationValue ||
        prop.enumerationValues[0].enumerationValue.length === 0
    ) {
        throw new PluginError("Typing generation", {
            message: "[XML] Enumeration property requires enumerations element"
        });
    }
    const typeName = capitalizeFirstLetter(prop.$.key)+'Enum';
    const types = prop.enumerationValues[0].enumerationValue.map(type => `"${type.$.key}"`);
    childTypes.push(`export type ${typeName} = ${types.join(" | ")};`);
    return typeName;
}

const generateChildProps = (prop, childTypes, webmodeler = false) => {
    if (
        !prop.properties ||
        prop.properties.length === 0 ||
        !prop.properties[0].property ||
        prop.properties[0].property.length === 0
    ) {
        throw new PluginError("Typing generation", {
            message: "[XML] Object property requires properties element"
        });
    }
    const properties = prop.properties[0].property;
    const hasDynamicProps = webmodeler
      ? properties
          .map(prop => translateType(prop, []))
          .filter(
             type =>
               type.indexOf("DynamicValue") !== -1 ||
               type.indexOf("EditableValue") !== -1
          ).length > 0 : false;
    const typeName = capitalizeFirstLetter(prop.$.key)+(hasDynamicProps ? 'TypeWebModeler': 'Type');
    if (!webmodeler || (webmodeler && hasDynamicProps)) {
        childTypes.push(`export interface ${typeName} {
${properties
        .map(prop => {
            let name = prop.$.key;
            if (prop.$.hasOwnProperty("required") && prop.$.required === "false") {
                name += "?";
            }
            const type = translateType(prop, childTypes, webmodeler);
            return `    ${name}: ${type};`;
        }).join('\n')}
}`);
    }
    return typeName;
};

const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const findTypes = attributeTypes => {
    if (!attributeTypes.hasOwnProperty("attributeType") || attributeTypes.attributeType.length === 0) { //Alterado
        throw new PluginError("Typing generation", {
            message: "[XML] Attribute property requires attributeTypes element"
        });
    }
    let types = attributeTypes.attributeType
        .filter(type => type.hasOwnProperty("$") && type.$.hasOwnProperty("name"))
        .map(type => type.$.name)
        .map(type => translateAttributeType(type));
    const uniqueTypes = new Set();
    types.forEach(type => {
        !uniqueTypes.has(type) ? uniqueTypes.add(type) : null;
    });
    types = Array.from(uniqueTypes).join(` | `);
    return types;
};

const translateAttributeType = type => {
    switch (type) {
        case "Boolean":
            return "boolean";
        case "DateTime":
            return "Date";
        case "AutoNumber":
        case "Decimal":
        case "Integer":
        case "Long":
            return "BigJs.Big";
        case "HashString":
        case "String":
        case "Enum":
            return "string";
        default:
            return "any";
    }
};

function extractVisibilityMap(prop, childTypesVisibility) {
    if (
        !prop.properties ||
        prop.properties.length === 0 ||
        !prop.properties[0].property ||
        prop.properties[0].property.length === 0
    ) {
        throw new PluginError("Typing generation", {
            message: "[XML] Object property requires properties element"
        });
    }
    const properties = prop.properties[0].property;
    const name = `${capitalizeFirstLetter(prop.$.key)}VisibilityType`;
    if (prop.$.hasOwnProperty("isList")) {
        if (prop.$.isList) {
            childTypesVisibility.push(`export interface ${name} {
${properties.map(p => `    ${p.$.key}: boolean;`).join("\n")}
}`);
        }
    }
    return `${prop.$.key}: ${name}[]`;
}

module.exports = (content, widgetName) => {
    const jsonContent = JSON.parse(content);
    if (
        !jsonContent ||
        !jsonContent.widget ||
        !jsonContent.widget.properties ||
        !jsonContent.widget.properties.length === 0 ||
        !jsonContent.widget.properties[0].property ||
        jsonContent.widget.properties[0].property.length === 0
    ) {
        throw new PluginError("Typing generation", {
            message: "[XML] XML doesn't contains properties element"
        });
    }
    const properties = jsonContent.widget.properties[0].property;
    const childTypes = [];
    const mainTypes = properties
        .map(prop => {
            let name = prop.$.key;
            if (prop.$.hasOwnProperty("required") && prop.$.required === "false") {
                name += "?";
            }
            const type = translateType(prop, childTypes);
            return `    ${name}: ${type};`;
        }).join("\n");
    const modelerTypes = properties
        .map(prop => {
            let name = prop.$.key;
            if (prop.$.hasOwnProperty("required") && prop.$.required === "false") {
                name += "?";
            }
            const type = translateType(prop, childTypes, true);
            return `    ${name}: ${type};`;
        }).join("\n");
    const modelerVisibilityMap = properties
        .map(prop => {
            if (prop.$.type !== "object") {
                return `    ${prop.$.key}: boolean`;
            } else {
                return `    ${extractVisibilityMap(prop, childTypes)} | boolean`;
            }
        })
        .join("\n");

    let newContent = `/**
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
}${childTypes.length > 0 ? "\n\n"+childTypes.join("\n\n"):""}

export interface ${widgetName}ContainerProps extends CommonProps {
${mainTypes}
}

export interface ${widgetName}WebModelerProps extends CommonProps {
${modelerTypes}
}

export interface VisibilityMap {
${modelerVisibilityMap}
}
`;
    return newContent;
};
