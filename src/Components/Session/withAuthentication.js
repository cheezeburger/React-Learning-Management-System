import React from 'react';
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import { Loader } from 'rsuite';

const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                authUser: null
            };
        }

        componentDidMount() {
            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    this.setState({ authUser });
                },
                () => {
                    this.setState({ authUser: null });
                }
            );
        }

        render() {
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} authUser={this.state.authUser}/>
                </AuthUserContext.Provider>

            );
        }
    }
    return withFirebase(WithAuthentication);
};
export default withAuthentication;
