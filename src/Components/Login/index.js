import React, {Component} from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import TopNavBar from '../Navbar/TopNavBar';
import {Container, Content, FlexboxGrid, Panel, Header, Footer} from 'rsuite';
import { compose } from 'recompose';
import { AuthUserContext } from '../Session';

class LoginPage extends Component {
    componentDidMount(){
        this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
            if(authUser){
                this.props.history.push('/dashboard');
            }
        })
    }
    
    componentWillUnmount(){
        this.listener();
    }

    render(){
        return(
            <AuthUserContext.Consumer>{authUser => {
                const View = !authUser? (
                    <div>
                        <Container style={{height: '100vh'}}>
                            <Header>
                                <TopNavBar/>
                            </Header>
                            <Content style={{margin: '20px', padding: '20px'}}>
                                <FlexboxGrid justify='center'>
                                    <FlexboxGrid.Item colspan={12}>
                                        <Panel header={<h2>Login</h2>} bordered>
                                            <LoginForm {...this.props}/>
                                        </Panel>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </Content>
                            <Footer style={{padding: '20px', backgroundColor: 'black'}}>ShaneLMS</Footer>
                        </Container>
                    </div>
                ): ''

                return View;
            }}
            </AuthUserContext.Consumer>
            
            
        )
    }
}

const Login = compose(
    withRouter,
    withFirebase,
)(LoginPage);

export default (Login);