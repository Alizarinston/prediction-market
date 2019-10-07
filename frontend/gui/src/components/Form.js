import React from 'react';
import axios from 'axios';
import WrappedDynamicFieldSet from "./DynamicForm";
import { Button, Checkbox, Form, Message, TextArea, Segment, Grid, Select } from 'semantic-ui-react'
import {
  DatesRangeInput
} from 'semantic-ui-calendar-react';


class CustomForm extends React.Component {

    state = {
        anon: false,
        datesRange: '',
        err: false,
        success: false,
        stateValue: null
    };

    handleSelectChange=(e,{value})=>this.setState({stateValue:value});

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
        const category = this.state.stateValue;
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

        // console.log(title, description, anon, outcomes, start_date, end_date, category);

        if (title === '') {
            this.setState({err: true});
            return false
        } else {
            this.setState({err: false, success: true});
        }

        // need much more

        switch (requestType) {
            case 'post':
                return axios.post('http://127.0.0.1:8000/api/markets/', {
                    name: title,
                    start_date: start_date,
                    end_date: end_date,
                    anon: anon,
                    outcomes: outcomes,
                    categories: category,
                    description: description
                })
                    .then(res => console.log(res))
                    .catch(error =>
                        console.error(error));
        }

    };

    render() {
        const categoryOptions = [
            { key: 'F', value: 'Finances', text: 'Finances' },
            { key: 'P', value: 'Politics', text: 'Politics' },
            { key: 'S', value: 'Sports', text: 'Sports' },
            { key: 'O', value: 'Other', text: 'Other' },
        ];
        return (

            <Grid columns={3} divided>
                <Grid.Column/>
                    <Grid.Column>

                        <Segment>
                          <Form error={this.state.err} success={this.state.success} onSubmit={(event) => this.handleFormSubmit(
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
                              <TextArea name="description" placeholder='Enter some content' style={{ minHeight: 100 }} />
                            </Form.Field>

                              <Form.Field>
                                  <label>Outcomes</label>
                                  <WrappedDynamicFieldSet />
                              </Form.Field>

                            <Form.Field>
                              <Checkbox toggle onChange={this.onChange} label="Anon" />
                            </Form.Field>

                            <Form.Field>
                                <Select placeholder='Select category' options={categoryOptions} onChange={this.handleSelectChange}/>
                            </Form.Field>

                            <Button type="primary" htmltype="submit">{this.props.btnText}</Button>

                            <Message
                                error
                                header='All fields required!'
                                content='You should fill in all required fields.'
                            />

                            <Message
                                success
                                header='Your proposal were created successful'
                                content='You can now see it in proposal list'
                            />

                          </Form>
                        </Segment>

                    </Grid.Column>
                <Grid.Column/>
            </Grid>

        );
    }
}

export default CustomForm;

