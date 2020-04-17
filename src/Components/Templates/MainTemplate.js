import React from 'react';
import SideNavigation from '../Navbar/SideNavigation';
import TopNavBar from '../Navbar/TopNavBar'
import { Container} from 'rsuite';
import { AuthUserContext, } from '../Session';

const mainTemplate = (Header, BreadCrumb, Body) =>{
    class MainTemplate extends React.Component{

        render(){
            return(
                <AuthUserContext.Consumer>
                    {authUser => {
                        const flexDir = authUser? 'row': 'column';

                        return(
                            <Container style={{flex: 1, flexDirection: flexDir, minHeight: '100%'}}>
                            {
                                authUser? 
                                    <SideNavigation {...authUser}/>
                                :   <TopNavBar/>
                            }
    
                            <Container style={{flex: 1, flexDirection: 'column'}}>
                                {authUser?
                                    <Container style={{flex: 1, backgroundColor: '#f5f5f5', minHeight: '50px'}}>
                                        <Header {...this.props} authUser={authUser}/>
                                    </Container>
                                : null
                                }
    
                                <Container style={{flex: 1,  margin: '0px'}}>
                                    <Container style={{flex: 1}}>
                                        {
                                            authUser?
                                                <Container style= {{fontSize: '20px'}}>
                                                    <BreadCrumb {...this.props}/>
                                                </Container> 
                                            : null
                                        }
                                        <Container style={{flex: 1, margin: '20px', fontSize: '20px'}}>
                                            <Body {...this.props} authUser={authUser}/>
                                        </Container>
                                    </Container>
                                </Container>
                            </Container>
                        </Container>
                        )
                    }}
                </AuthUserContext.Consumer>
            )
        }
    }
    return MainTemplate;
}

export default mainTemplate;