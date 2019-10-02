import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { DatePicker } from 'antd';
import moment from 'moment';
import axios from 'axios';
import WrappedDynamicFieldSet from "./DynamicForm";

const { RangePicker } = DatePicker;

class CustomForm extends React.Component {

    state = {
        startD: null,
        endD: null,
        anon: false
    };

    onChange = (e) => {
        this.setState({
            anon: e.target.checked
        });
    };

    handleChangeDebut = (range) => {
        this.setState({
            startD: range[0].format('YYYY-MM-DD'),
            endD: range[1].format('YYYY-MM-DD')
        });
    };

    handleFormSubmit = (event, requestType) => {
        event.preventDefault();
        const title = event.target.elements.title.value;
        const description = event.target.elements.description.value;
        const anon = this.state.anon;
        const start_date = this.state.startD;
        const end_date = this.state.endD;

        const out = event.target.elements.outcomes;
        const outcomes = [];
        for (const i in out) {
            if (i === 'value' || out[i].value === undefined) {
                break
            }
            outcomes.push({"description": out[i].value});
        }

        switch (requestType) {
            case 'post':
                return axios.post('http://127.0.0.1:8000/api/markets/', {
                    name: title,
                    start_date: start_date,
                    end_date: end_date,
                    supply: 0,
                    anon: anon,
                    outcomes: outcomes,
                    description: description
                })
                    .then(res => console.log(res))
                    .catch(error => console.error(error));
        }

    };

    render() {
        return (
          <div>
            <Form onSubmit={(event) => this.handleFormSubmit(
                event,
                this.props.requestType)}>
              <Form.Item label="Title">
                <Input name="title" placeholder="Put a title here" />
              </Form.Item>
              <Form.Item label="Date">
              <RangePicker
          ranges={{
            Today: [moment(), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
          }}
          onChange={this.handleChangeDebut}
        />
              </Form.Item>
              <Form.Item label="Outcomes">
                  <WrappedDynamicFieldSet />
              </Form.Item>
              <Form.Item label="Description">
                <Input name="description" placeholder="Enter some content" />
              </Form.Item>
              <Checkbox onChange={this.onChange} label="Anon">
                Anon
              </Checkbox>
              <Form.Item>
                <Button type="primary" htmlType="submit">{this.props.btnText}</Button>
              </Form.Item>
            </Form>
          </div>
        );
    }
}

export default CustomForm;

