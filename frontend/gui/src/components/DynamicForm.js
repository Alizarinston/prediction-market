import React from "react";
import { Form, Input, Icon, Button } from "antd";

const FormItem = Form.Item;

let uuid = 2;
class DynamicFieldSet extends React.Component {
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    // We need at least one passenger
    if (keys.length === 2) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  // handleSubmit2 = e => {
  //   e.preventDefault();
  //   const outcomes = e.target.value;
  //   console.log(outcomes);
  //   e.stopPropagation();
  //   // return false
  //   // e.stopPropagation();
  //   // this.props.form.validateFields((err, values) => {
  //   //   if (!err) {
  //   //     console.log("Received values of form: ", values);
  //   //   }
  //   // });
  // };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    getFieldDecorator("keys", { initialValue: [0,1] });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k) => {
      return (
        <FormItem
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
              name="outcomes"//{`outcomes${k}`}
              placeholder="outcome description"
              style={{ width: "60%", marginRight: 8 }}
            />
          )}
          {keys.length > 2 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 2}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </FormItem>
      );
    });
    return (
      <div>
        {formItems}
        <FormItem>
          <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
            <Icon type="plus" /> Add outcome
          </Button>
        </FormItem>
        <FormItem>
        </FormItem>
      </div>
    );
  }
}

const WrappedDynamicFieldSet = Form.create()(DynamicFieldSet);
export default WrappedDynamicFieldSet;