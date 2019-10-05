import React from 'react';
import axios from 'axios';
import WrappedDynamicFieldSet from "./DynamicForm";
import { Button, Checkbox, Form } from 'semantic-ui-react'
import {
  DatesRangeInput
} from 'semantic-ui-calendar-react';


class CustomForm extends React.Component {

    state = {
        anon: false,
        datesRange: ''
    };

    onChange = (event, data) => {
        this.setState({
            anon: data.checked
        });
    };

    handleChange = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  };

    handleFormSubmit = (event, requestType) => {
        event.preventDefault();
        const title = event.target.elements.title.value;
        const description = event.target.elements.description.value;
        const anon = this.state.anon;
        const start_date = this.state.datesRange.substring(0,10);
        const end_date = this.state.datesRange.substring(13,23);

        const out = event.target.elements.outcomes;
        const outcomes = [];
        for (const i in out) {
            if (i === 'value' || out[i].value === undefined) {
                break
            }
            outcomes.push({"description": out[i].value});
        }

        console.log(title, description, anon, outcomes, start_date, end_date)

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

                <Form.Field>
                  <label>Title</label>
                  <input name="title" placeholder='Put a title here' />
                </Form.Field>

                <Form.Field>
                    <label>Date</label>
                    <DatesRangeInput
                      dateFormat={"YYYY-MM-DD"}
                      name="datesRange"
                      placeholder="From - To"
                      value={this.state.datesRange}
                      iconPosition="left"
                      onChange={this.handleChange}
                    />
                </Form.Field>

                <Form.Field>
                  <label>Description</label>
                  <input name="description" placeholder='Enter some content' />
                </Form.Field>

                  <Form.Field>
                      <label>Outcomes</label>
                      <WrappedDynamicFieldSet />
                  </Form.Field>

                <Form.Field>
                  <Checkbox toggle onChange={this.onChange} label="Anon" />
                </Form.Field>

                <Button type="primary" htmltype="submit">{this.props.btnText}</Button>

              </Form>
          </div>
        );
    }
}

export default CustomForm;

