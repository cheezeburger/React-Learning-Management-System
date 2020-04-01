import React, {Component} from 'react';
import { 
    Form, 
    FormGroup,
    FormControl, 
    ControlLabel, 
    Button,
    ButtonToolbar,
    Message,
    Alert,
} from 'rsuite';

const INITIAL_STATE = {
    name: '',
    email: '',
    password: '',
    isAdmin: false,
    error: '',
};

export default class SignupForm extends Component{
    constructor(props){
        super(props);

        this.state = {
            errorPlacement: 'bottomStart',
            showEmailError: false,
            isFormSubmit: false,

            ...INITIAL_STATE
        }

        this.formSubmit = this.formSubmit.bind(this);
    }
    
    formSubmit(e) {
        const { name, email, password, isAdmin } = this.state;
        const roles = {};

        if(isAdmin){
            roles['userRole'] = 'admin';
        }
        else{
            roles['userRole'] = 'student';
        }
        
        this.props.firebase.doCreateUserWithEmailAndPassword(email, password).then(authUser => {
            return this.props.firebase.user(authUser.user.uid).set({name, email, roles})
        }).then(() => {
            this.setState({ ...INITIAL_STATE });
            Alert.success('Successfully registered. Redirecting...', 5000)
            this.props.history.push('/dashboard');

        }).catch(error => {
            let message = error.message;
            this.setState({error: message});
        });

        e.preventDefault();
    };

    render(){
        const { showEmailError, errorPlacement } = this.state;
        const emailErrorMessage = showEmailError ? 'This field is required' : null;
        const password = this.state.password;
        const passwordErrorMessage = (password && password.length > 2 && password.length < 10) ? 'Password must contain at least 10 characters' : '';

        const isInvalid =
            !this.state.name ||
            !this.state.email ||
            !(this.state.password && this.state.password.length >= 10);

        return(
            <div>
                <Form fluid layout="vertical" 
                    onChange={formValue => {
                        this.setState({
                            name: formValue.name,
                            email: formValue.email,
                            password: formValue.password,
                        });
                    }}>
                    <FormGroup>
                        <ControlLabel>Full Name</ControlLabel>
                        <FormControl 
                            name="name"
                            errorMessage= {emailErrorMessage}
                            errorPlacement = {errorPlacement}
                        />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Email</ControlLabel>
                        <FormControl 
                            name="email"
                            errorMessage= {emailErrorMessage}
                            errorPlacement = {errorPlacement}
                        />
                    </FormGroup>

                    <FormGroup
                        style={{type:"password"}}    
                    >
                        <ControlLabel>Password</ControlLabel>
                        <FormControl 
                            name="password"
                            errorMessage= {passwordErrorMessage}
                            errorPlacement= {errorPlacement}
                            type= "password"
                        />
                    </FormGroup>

                    {this.state.error?  
                        <div style ={{  position: 'relative', margin: '20px'}}>
                            <Message showIcon type="error" description={this.state.error} />
                        </div>
                    : ''}

                    <FormGroup>
                        <ButtonToolbar>
                            <Button disabled= {isInvalid} appearance="ghost" onClick={this.formSubmit}>Signup</Button>
                        </ButtonToolbar>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}