import React from "react";
import SunEditor from "suneditor-react";
import { compose } from "recompose";

import "suneditor/dist/css/suneditor.min.css";

import {
    Container,
    Nav,
    Navbar,
    Icon,
    Button,
    Alert,
    Form,
    ControlLabel,
    FormGroup,
    FormControl,
    ButtonGroup,
    Modal,
} from "rsuite";
import ReactHtmlParser from "react-html-parser";
import { withAuthentication } from "../../../Session";
import withAssignment from "./withAssignment";

class AssignmentPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            contentState: "",
            assignmentsQ: [],
            show: false,
        };
    }
    
    componentDidMount() {
        const assignmentId = this.props.match.params.id;
        const courseId = this.props.match.url
            .replace(/\/.*?\//g, "")
            .replace(assignmentId, "");

        this.props.firebase
            .assignments(`-${courseId}`)
            .child(`-${assignmentId}`)
            .child("questions")
            .on("value", (snapshot) => {
                this.setState({
                    assignmentsQ: snapshot.val() ? snapshot.val() : [],
                });
            });
    }

    studentHasAttempted = (assignmentId) => {
        const uid = this.props.authUser? this.props.firebase.auth.currentUser.uid: null;
        let submissions = [];
        if(uid){
            this.props.firebase.user(uid).child('enrolledCourses').on('value', snapshot => {
                snapshot.forEach(child => {
                    const submission = child.val().submissions;
                    if(submission){
                        submissions.push(submission)
                    }
                })
            })
        }

        if(submissions.length){
            submissions = submissions.map(item => {
                const keys = Object.keys(item);
                // return item[key].assId;
                return keys.map(key => {
                    return item[key].assId;
                })
            })

            submissions = submissions.flat();
        }

        return submissions.includes(assignmentId)? true : false;
    }

    editorOnChange = (contentState) => {
        this.setState({ contentState });
    };

    saveQuestions = () => {
        const assignmentId = this.props.match.params.id;
        const courseId = this.props.match.url
            .replace(/\/.*?\//g, "")
            .replace(assignmentId, "");
        this.props.updateAssignment(
            "-" + courseId,
            "-" + assignmentId,
            this.state.assignmentsQ
        );
        this.closeModal();
    };

    addQuestion = () => {
        if (this.state.contentState) {
            let assignmentsQ = this.state.assignmentsQ
                ? this.state.assignmentsQ
                : [];
            assignmentsQ.push(this.state.contentState);
            this.setState({ assignmentsQ });
        } else {
            Alert.error("Content cannot be blank.");
        }

        this.setState({ contentState: "" });
    };

    removeQ = (i) => {
        let assignmentsQ = this.state.assignmentsQ;
        assignmentsQ = assignmentsQ.filter((ass, index) => {
            return index != i;
        });

        this.setState({ assignmentsQ });
    };

    renderQuestions = (stud = false) => {
        const assignmentsQ = this.state.assignmentsQ;
        const assignmentId = this.props.match.params.id;
        
        const attempted = (this.studentHasAttempted(assignmentId));

        return (
            <Container style={{ minHeight: "120px" }}>
                <div style={{ marginBottom: "30px" }}>
                    <h1>Assignment</h1>
                </div>

                <Form
                    onChange={(formValue) => {
                        this.setState({formValue})
                    }}
                    style={{ marginBottom: "20px" }}
                >
                    {assignmentsQ.map((question, i) => {
                        return (
                            <>
                                <FormGroup key={i}>
                                    <ControlLabel>
                                        Question {i + 1}
                                    </ControlLabel>
                                    {ReactHtmlParser(question)}
                                    <FormControl name={`q${i + 1}`} disabled={attempted? true: false}/>
                                    {!stud ? (
                                        <Button
                                            color="red"
                                            onClick={() => this.removeQ(i)}
                                        >
                                            Remove
                                        </Button>
                                    ) : null}
                                </FormGroup>
                            </>
                        );
                    })}
                    {
                        stud? 
                        <FormGroup>
                            {attempted?
                            <Button
                                appearance="ghost"
                                color="red"
                                onClick={this.studentSubmitAnswer}
                                style={{ width: "100%" }}
                                disabled= {attempted? true : false}
                            >
                                Submitted
                            </Button>  
                            :<Button
                                appearance="ghost"
                                onClick={this.studentSubmitAnswer}
                                style={{ width: "100%" }}
                                disabled= {attempted? true : false}
                            >
                                Finish and Submit
                            </Button>  
                            }
                            
                        </FormGroup>   
                        :null 
                    }
                </Form>
            </Container>
        );
    };

    closeModal = () => {
        this.setState({ show: false });
    };

    openModal = () => {
        this.setState({ show: true });
    };

    studentSubmitAnswer = () => {
        const uid = this.props.firebase.auth.currentUser.uid;
        const assId = this.props.match.params.id;
        const courseId = this.props.match.url.replace(/\/.*?\//g, '').replace(assId, '');

        const formValue = this.state.formValue;
        if(formValue){
            const authUser = this.props.authUser;
            
            let enrolledCourses = authUser.enrolledCourses;
            const enrolledCoursesKey = Object.keys(authUser.enrolledCourses);

            enrolledCourses = enrolledCoursesKey.map(key => {
                return {
                    snapshotKey: key,
                    courseId: enrolledCourses[key].courseId
                }
            })
            
            enrolledCourses = enrolledCourses.filter(item =>{
                return item.courseId === courseId;
            })
            
            const dateNow = Date.now();

            this.props.firebase.user(uid).child('enrolledCourses').child(enrolledCourses[0].snapshotKey).child('submissions').push({
                status: 'new',
                assId,
                answers: formValue,
                submittedOn: dateNow,
            }).then(rsp => {
                Alert.success('Successfully submitted');

                this.props.firebase.course(`-${courseId}`).child('submissions').push({
                    status: 'new',
                    studentId: uid,
                    studentName: authUser.name,
                    submittedOn: dateNow,
                    snapshotKey: rsp.key,
                })
            })
        }
        else{
            Alert.error('Please answer all questions.');
        }
    }

    renderForAdmin = () => {
        return (
            <>
                <Navbar appearance="inverse">
                    <Nav
                        pullLeft
                        onSelect={() => {
                            this.props.history.goBack();
                        }}
                    >
                        <Nav.Item
                            icon={<Icon size="2x" icon="chevron-left" />}
                        />
                    </Nav>
                </Navbar>

                <Container
                    style={{
                        marginTop: "20px",
                        flexWrap: "wrap",
                        margin: "20px",
                    }}
                >
                    {this.renderQuestions()}

                    <SunEditor
                        placeholder="Please type here..."
                        setOptions={{
                            height: "auto",
                            resizingBar: false,
                            buttonList: [
                                ["bold", "underline", "italic"],
                                ["list", "fontColor", "hiliteColor"],
                                ["image"],
                            ],
                        }}
                        onChange={this.editorOnChange}
                    />

                    <ButtonGroup style={{ textAlign: "center" }}>
                        <Button
                            appearance="primary"
                            style={{ marginTop: "20px", width: "50%" }}
                            onClick={this.openModal}
                        >
                            Save All
                        </Button>
                        <Button
                            appearance="primary"
                            style={{ marginTop: "20px", width: "50%" }}
                            onClick={this.addQuestion}
                            disabled={this.state.contentState ? false : true}
                        >
                            Add
                        </Button>
                        <Modal
                            backdrop="static"
                            show={this.state.show}
                            onHide={this.close}
                            size="xs"
                        >
                            <Modal.Body>
                                <Icon
                                    icon="remind"
                                    style={{
                                        color: "#ffb300",
                                        fontSize: 24,
                                    }}
                                />{" "}
                                Confirm saving/overwriting changes?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    onClick={this.saveQuestions}
                                    appearance="primary"
                                >
                                    Ok
                                </Button>
                                <Button
                                    onClick={this.closeModal}
                                    appearance="subtle"
                                >
                                    Cancel
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </ButtonGroup>
                </Container>
            </>
        );
    };

    renderForStudent = () => {
        return (
            <>
                <Navbar appearance="inverse">
                    <Nav
                        pullLeft
                        onSelect={() => {
                            this.props.history.goBack();
                        }}
                    >
                        <Nav.Item
                            icon={<Icon size="2x" icon="chevron-left" />}
                        />
                    </Nav>
                </Navbar>

                <Container
                    style={{
                        marginTop: "20px",
                        flexWrap: "wrap",
                        margin: "20px",
                        alignItems: "center",
                    }}
                >
                    {this.renderQuestions(true)}
                </Container>
            </>
        );
    };

    render() {
        const authUser          = this.props.authUser;
        const hasEditAuthority  = authUser && authUser.roles.userRole === "admin";
        let coursesCreated      = null;
        let isCourseCreator     = null;

        if (hasEditAuthority) {
            coursesCreated = Object.keys(
                authUser.coursesCreated
            ).map((key) => ({
                ...authUser.coursesCreated[key],
                uid: key,
            }));
            coursesCreated = coursesCreated.map((item) => {
                return item.courseId;
            });

            const curriId = this.props.match.params.id;
            const courseId = this.props.match.url
                .replace(/\/.*?\//g, "")
                .replace(curriId, "");

            isCourseCreator = coursesCreated.includes(courseId);
        }

        return (
            <Container style={{ flex: 1, flexDirection: "column" }}>
                {isCourseCreator
                    ? this.renderForAdmin()
                    : this.renderForStudent()}
            </Container>
        );
    }
}

export default compose(
    withAuthentication,
    withAssignment)
(AssignmentPage);
