import React from "react";
import { Form as f } from 'semantic-ui-react'
import { Input, Icon } from 'semantic-ui-react'
import { Form, Button } from "antd";


const FormItem = Form.Item;

let uuid = 2;
class DynamicFieldSet extends React.Component {
  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    if (keys.length === 2) {
      return;
    }

    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(uuid);
    uuid++;
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    getFieldDecorator("keys", { initialValue: [0,1] });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k) => {
      return (
        <f.Field
          required={false}
          key={k}
        >
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ["onChange", "onBlur"],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input outcome description or delete this field."
              }
            ]
          })(
            <Input
              name="outcomes"
              placeholder="outcome description"
              style={{ width: "60%", marginRight: 8 }}
            />
          )}
          {keys.length > 2 ? (
            <Icon
              className="dynamic-delete-button"
              name={"minus circle"}
              disabled={keys.length === 2}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </f.Field>
      );
    });
    return (
      <div>
        {formItems}
        <FormItem>
          <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
            <Icon name="plus" /> Add outcome
          </Button>
        </FormItem>
      </div>
    );
  }
}

const WrappedDynamicFieldSet = Form.create()(DynamicFieldSet);
export default WrappedDynamicFieldSet;