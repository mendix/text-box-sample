import { Component, Fragment, ReactNode, createElement } from "react";
import { hot } from "react-hot-loader/root";

import { TextInput } from "./components/TextInput";
import { TextBoxContainerProps } from "../typings/TextBoxProps";
import { Alert } from "./components/Alert";

import "./ui/TextBox.css";

class TextBox extends Component<TextBoxContainerProps> {

    private readonly onLeaveHandle = this.onLeave.bind(this);

    componentDidMount() {
        this.props.textAttribute.setValidator(this.validator.bind(this));
    }

    render(): ReactNode {
        const value = this.props.textAttribute.value || "";
        const validationFeedback = this.props.textAttribute.validation;
        const required = !!(this.props.requiredMessage && this.props.requiredMessage.value);
        return <Fragment>
            <TextInput
                value={value}
                style={this.props.style}
                className={this.props.class}
                tabIndex={this.props.tabIndex}
                id={this.props.id}
                disabled={this.isReadOnly()}
                onLeave={this.onLeaveHandle}
                required={required}
                hasError={!!validationFeedback}
            />
            <Alert id={this.props.id + "-error"}>{validationFeedback}</Alert>
        </Fragment>;
    }

    private validator(value: string | undefined): string | undefined {
        const { requiredMessage } = this.props;

        if (requiredMessage && requiredMessage.value && !value) {
            return requiredMessage.value;
        }
        return;
    }

    private isReadOnly(): boolean {
        return this.props.editable === "never" || this.props.textAttribute.readOnly;
    }

    private onLeave(value: string, isChanged: boolean) {
        if (!isChanged) {
            return;
        }
        const { textAttribute, onChangeAction } = this.props;
        textAttribute.setValue(value);

        if (onChangeAction && onChangeAction.canExecute) {
            onChangeAction.execute();
        }
    }
}

export default hot(TextBox);
