import React, {Component} from 'react';
import { 
    Form, 
    FormGroup,
    FormControl, 
    ControlLabel, 
    Button,
    ButtonToolbar,
    Alert,
    Message
} from 'rsuite';

const INITIAL_STATE = {
    email: '',
    password: '',
    error: '',
};

export default class LoginForm extends Component{
    constructor(props){
        super(props);

        this.state = {
            errorPlacement: 'bottomStart',
            showEmailError: false,
            showPasswordError: false,
            isFormSubmit: false,

            ...INITIAL_STATE,
        }
        this.formSubmit = this.formSubmit.bind(this);
    }

    formSubmit(e) {
        const { email, password } = this.state;

        this.props.firebase.doSignInWithEmailAndPassword(email, password).then(() => {
            this.setState({ ...INITIAL_STATE });
            Alert.success('Successfully logged in. Redirecting...', 5000)
            this.props.history.push('/dashboard');
        }).catch(error => {
            let message = error.message;
            this.setState({ error: message });
        });

        e.preventDefault();
    };

    render(){
        const { showEmailError, showPasswordError, errorPlacement } = this.state;
        const emailErrorMessage = showEmailError ? 'This field is required' : null;
        const passwordErrorMessage = showPasswordError ? 'This field is required' : null;

        const isInvalid =
            !this.state.email ||
            !this.state.password

        return(
            <div>
                <Form fluid layout="vertical" 
                    onChange={formValue => {
                        this.setState({
                            email: formValue.email,
                            password: formValue.password,
                        });
                    }}>

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
                            <div>
                                <Button id="login" disabled= {isInvalid} appearance="ghost" onClick={this.formSubmit}>Login</Button>
                                {/* <Button appearance="link">Forgot password?</Button> */}
                            </div>
                        </ButtonToolbar>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}