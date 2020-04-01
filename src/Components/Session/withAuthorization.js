import React from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import AuthUserContext from './context';
import { Loader } from 'rsuite';

const withAuthorization = condition => Component => {
    class WithAuthorization extends React.Component {
        componentDidMount() {
            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    if (!condition(authUser)) {
                        this.props.history.push('/login');
                    }
                },
                () => this.props.history.push('/login')
            );
        }

        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser =>
                        condition(authUser) ? (
                            <Component {...this.props} />
                        ) : <Loader center content="loading" />
                    }
                </AuthUserContext.Consumer>
            );
        }
    }
    return compose(withRouter, withFirebase)(WithAuthorization);
};

export default withAuthorization;
