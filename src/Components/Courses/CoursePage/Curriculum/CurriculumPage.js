import React from 'react';
import SunEditor from 'suneditor-react';
import { compose } from 'recompose';

import 'suneditor/dist/css/suneditor.min.css';

import { Container, Nav, Navbar, Icon } from 'rsuite';
import withCurriculum from './withCurriculum';
import { AuthUserContext } from '../../../Session';

class CurriculumPage extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            contentState: '',
            sunEditor: {
                editing: false,
                resizingBar: false,
                enable: false,
                showToolbar: false,
                disable: true,
            }
        }

        this.editorOnChange = this.editorOnChange.bind(this);
        this.editorSave = this.editorSave.bind(this);
        this.editToggle = this.editToggle.bind(this);
    }

    componentDidMount(){
        const curriId = this.props.match.params.id;
        const courseId = this.props.match.url.replace(/\/.*?\//g, '').replace(curriId, '');
        this.props.getCurriculum(courseId, curriId);
        
        this.props.firebase.courseCurriculums(`-${courseId}`)
            .child(`-${curriId}`)
            .child('curriculumContent')
            .on('value', snapshot=> {
                this.setState({contentState: snapshot.val()})
            }
        )
    }

    editToggle(){
        this.setState({
            sunEditor:{
                editing: !this.state.sunEditor.editing,
                resizingBar: !this.state.sunEditor.resizingBar,
                enable: !this.state.sunEditor.enable,
                showToolbar: !this.state.sunEditor.showToolbar,
                disable: !this.state.sunEditor.disable,
            }
        })
    }

    editorOnChange(content){
        this.setState({contentState: content});
    }
    
    editorSave(){
        const curriId = this.props.match.params.id;
        const courseId = this.props.match.url.replace(/\/.*?\//g, '').replace(curriId, '');
        this.props.updateCurriculum('-'+courseId, '-'+curriId, this.state.contentState);
    }

    render(){
        return(
            <AuthUserContext.Consumer>
                {authUser => {
                    const hasEditAuthority = authUser && authUser.roles.userRole === 'admin';
					let coursesCreated = null;
					let isCourseCreator = null;

					if(hasEditAuthority){
						coursesCreated = Object.keys(authUser.coursesCreated).map(
							key => ({
								...authUser.coursesCreated[key],
								uid: key
							})
						);
						coursesCreated = coursesCreated.map(item => {
							return item.courseId;
                        });
                        
                        const curriId = this.props.match.params.id;
                        const courseId = this.props.match.url.replace(/\/.*?\//g, '').replace(curriId, '');

						isCourseCreator = coursesCreated.includes(
							courseId
                        );
                    }
                    
                    return(
                        <Container>
                            <Navbar appearance='inverse'>
                                    <Nav pullLeft onSelect={()=>{this.props.history.goBack()}}>
                                        <Nav.Item icon={<Icon size="2x" icon="chevron-left" />} />
                                    </Nav>
                                {
                                    isCourseCreator?
                                        (this.state.sunEditor.editing? 
                                            <div>
                                                <Nav pullRight onSelect={this.editorSave}>
                                                    <Nav.Item icon={<Icon icon="save" />} >Save</Nav.Item>
                                                </Nav>
                                                <Nav pullRight onSelect={this.editToggle}>
                                                    <Nav.Item icon={<Icon icon="close" />} >Close</Nav.Item>
                                                </Nav>
                                            </div>
                                        :
                                            <div>
                                                <Nav pullRight onSelect={this.editToggle}>
                                                    <Nav.Item icon={<Icon icon="edit" />} >Edit</Nav.Item>
                                                </Nav>
                                            </div>
                                        )
                                    :
                                        (
                                            ''
                                        )
                                    
                                }
                                
                            </Navbar>
                            <Container style={{flex: 1}}>
                                <Container style={{flex: 1, alignItems: 'center'}}>
                                    <SunEditor 
                                        placeholder="Please type here..."
                                        resizingBar= {this.state.sunEditor.resizingBar}
                                        enable= {this.state.sunEditor.enable}
                                        showToolbar= {this.state.sunEditor.showToolbar}
                                        disable= {this.state.sunEditor.disable}
                                        setOptions={{
                                            height: 'auto',
                                            resizingBar: false,     
                                            buttonList: [[
                                                'formatBlock', 
                                                'font',
                                                'fontSize'],[
                                                'paragraphStyle',
                                                'align', 
                                                'list', 
                                                'lineHeight', 
                                                'fontColor', 
                                                'hiliteColor', 
                                                'horizontalRule', 
                                                'table'], 
                                                ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                                                ['fullScreen'],
                                                ['removeFormat'],
                                                ['outdent', 'indent'],
                                                ['image', 'link', 'video'],
                                            ],
                                        }}
                                        setContents= {this.state.contentState? this.state.contentState: 'No curriculum content found...'}
                                        onChange= {this.editorOnChange}
                                    />
                                </Container>                
                            </Container>
                        </Container>
                    )
                }}
            
            
            </AuthUserContext.Consumer>
        )
    }
}

// const condition = authUser => !!authUser;

export default compose(
    withCurriculum,
)(CurriculumPage); 
