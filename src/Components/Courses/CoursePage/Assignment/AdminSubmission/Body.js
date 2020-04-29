import React from 'react';
import {
    Container,
    Panel,
    Table,
    Button,
    Modal,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    InputNumber,
    Divider,
    Alert
} from 'rsuite';
import ReactHtmlParser from 'react-html-parser';

export default class Body extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            modalData: {},
            formValue: {}
        };
    }

    reviewAssignment = rowData => {
        this.props.firebase
            .user(rowData.studentId)
            .child('enrolledCourses')
            .on('value', snapshot => {
                let match = [];
                let submissions = [];
                let coursesList = this.props.coursesList;

                snapshot.forEach(item => {
                    let course = item.val();
                    course.enrolledCourseKey = item.key;

                    if (course.submissions) {
                        submissions.push(course);
                    }
                });

                //Get courseId and submissions of the course
                submissions = submissions
                    .map(item => {
                        const innerKeys = Object.keys(item.submissions);

                        const s = innerKeys.map(submissionKey => {
                            return {
                                submissionKey,
                                data: item.submissions[submissionKey]
                            };
                        });

                        return {
                            courseId: item.courseId,
                            enrolledCourseKey: item.enrolledCourseKey,
                            submissions: s
                        };
                    })
                    .flat();

                //Get matching course with matching rowData.snapshotKey
                match = submissions.filter(item => {
                    const temp = Object.keys(item.submissions).map(key => {
                        return item.submissions[key].submissionKey;
                    });

                    return temp.includes(rowData.snapshotKey);
                });

                //Get only the submission that match the rowData.snapshotKey
                match = match.map(item => {
                    item.submissions = item.submissions.filter(inner => {
                        return inner.submissionKey === rowData.snapshotKey;
                    });

                    item.submissions = item.submissions[0];
                    return item;
                });

                let assId = match.map(item => {
                    return `-${item.submissions.data.assId}`;
                })[0];

                //Extracting assignments to obtain original questions
                let assignments = coursesList.map(item => {
                    return item.assignments;
                });

                assignments = assignments.filter((course, i) => {
                    if(course){
                        const keys = Object.keys(course);
                        return keys.includes(assId);
                    }
                });
                
                assignments = assignments[0][assId].questions;

                this.setState({
                    show: true,
                    modalData: {
                        questions: assignments,
                        submissionData: match[0],
                        rowData
                    }
                });
            });
    };

    close = () => {
        this.setState({ show: false });
    };

    onReviewSubmit = modalData => {
        let { marks, comments } = this.state.formValue;
        const uid = this.props.firebase.auth.currentUser.uid;
        let { rowData, submissionData } = modalData;
        marks = marks ? marks : rowData.marks ? rowData.marks : null;

        if (!marks) {
            Alert.error('Marks cannot be empty.');
        } else {
            const date = Date.now();

            comments = comments
                ? comments
                : rowData.comments
                ? rowData.comments
                : null;
            this.props.firebase
                .course(`-${submissionData.courseId}`)
                .child('submissions')
                .child(rowData.key)
                .update({
                    status: 'reviewed',
                    comments,
                    reviewedOn: date,
                    reviewedBy: uid,
                    marks: marks
                })
                .then(() => {
                    this.props.firebase
                        .user(rowData.studentId)
                        .child('enrolledCourses')
                        .child(submissionData.enrolledCourseKey)
                        .child('submissions')
                        .child(submissionData.submissions.submissionKey)
                        .update({
                            status: 'reviewed',
                            reviewedOn: date,
                            reviewer: this.props.authUser.name,
                            reviewerId: uid,
                            comments,
                            marks
                        })
                        .then(() => {
                            Alert.success('Successfully reviewed.');
                            this.setState({ show: false });
                        });
                });
        }
    };

    renderModal = modalData => {
        let { submissionData, questions, rowData } = modalData;
        let answer = submissionData.submissions.data.answers;

        answer = Object.keys(answer).map(key => {
            return answer[key];
        });

        let qna = [];

        for (let i = 0; i < questions.length; i++) {
            qna.push({
                question: questions[i],
                answer: answer[i]
            });
        }

        return (
            <Modal overflow={true} show={this.state.show} onHide={this.close}>
                <Modal.Header>
                    <Modal.Title>Assignment Review</Modal.Title>
                </Modal.Header>
                <Divider>Student Submission</Divider>
                <Modal.Body>
                    <Form
                        style={{ marginBottom: '20px' }}
                        onChange={formValue => {
                            this.setState({ formValue });
                        }}
                        formDefaultValue={{
                            comments: rowData.comments
                                ? rowData.comments
                                : null,
                            marks: rowData.marks ? rowData.marks : null
                        }}>
                        {qna.map((item, i) => {
                            return (
                                <div key={i}>
                                    <FormGroup style={{ marginBottom: '10px' }}>
                                        <ControlLabel>Q{i + 1}</ControlLabel>
                                        {ReactHtmlParser(item.question)}
                                        <FormControl
                                            style={{
                                                width: '200',
                                                resize: 'auto'
                                            }}
                                            rows={3}
                                            componentClass='textarea'
                                            name='answer'
                                            readOnly
                                            plainText
                                            value={item.answer}
                                        />
                                    </FormGroup>
                                </div>
                            );
                        })}
                        <Divider>Marks allocation and Comments</Divider>
                        <FormGroup>
                            <ControlLabel>
                                <span style={{ fontWeight: 'bold' }}>
                                    Instructor comment (Optional):
                                </span>
                            </ControlLabel>
                            <FormControl
                                style={{ width: '200', resize: 'auto' }}
                                rows={5}
                                componentClass='textarea'
                                name='comments'
                            />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>
                                <span style={{ fontWeight: 'bold' }}>
                                    Marks{' '}
                                    {rowData.marks ? (
                                        <span style={{ color: 'red' }}>
                                            {rowData.marks}
                                        </span>
                                    ) : null}
                                    / 100% :
                                </span>
                            </ControlLabel>
                            <FormControl name='marks' accepter={InputNumber} />
                        </FormGroup>

                        <FormGroup>
                            {rowData.marks ? (
                                <Button
                                    onClick={() =>
                                        this.onReviewSubmit(modalData)
                                    }
                                    style={{ width: '100%' }}
                                    color='red'>
                                    Update
                                </Button>
                            ) : (
                                <Button
                                    id='submitBtn'
                                    onClick={() =>
                                        this.onReviewSubmit(modalData)
                                    }
                                    style={{ width: '100%' }}
                                    color='blue'>
                                    Submit
                                </Button>
                            )}
                        </FormGroup>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    };

    render() {
        const modalData =
            this.state.modalData &&
            this.state.modalData.questions &&
            this.state.modalData.submissionData
                ? this.state.modalData
                : null;
        let coursesList = this.props.coursesList;
        let uid = this.props.authUser ? this.props.authUser.uid : null;
        let submissions = [];
        let coursesCreated =
            this.props.authUser && this.props.authUser.coursesCreated
                ? this.props.authUser.coursesCreated
                : null;

        if (coursesCreated) {
            coursesCreated = Object.keys(coursesCreated).map(key => {
                return coursesCreated[key].courseId;
            });

            coursesList = coursesList.filter(item => {
                return item.createdBy === uid;
            });

            submissions = coursesList.map(course => {
                return {
                    title: course.title,
                    submissions: course.submissions
                };
            });

            submissions = submissions.map(item => {
                if (item.submissions) {
                    item.submissions = Object.keys(item.submissions).map(
                        key => {
                            item.submissions[key].key = key;
                            return item.submissions[key];
                        }
                    );
                }

                return item;
            });
            if (submissions.submissions) {
                submissions.submissions.reverse();
            }
        }

        return (
            <Container
                style={{ flex: 1, marginLeft: '20px', fontSize: '13px' }}>
                {modalData ? this.renderModal(modalData) : null}

                {submissions.map(item => {
                    return (
                        <>
                            <h4>{item.title}</h4>
                            <Panel bordered>
                                <Table data={item.submissions}>
                                    <Table.Column width={160} resizable>
                                        <Table.HeaderCell>
                                            Submitted On
                                        </Table.HeaderCell>
                                        <Table.Cell resizable>
                                            {rowData => {
                                                const date = new Date(
                                                    rowData.submittedOn
                                                ).toLocaleString();

                                                return <p>{date}</p>;
                                            }}
                                        </Table.Cell>
                                    </Table.Column>

                                    <Table.Column
                                        align='center'
                                        width={200}
                                        resizable>
                                        <Table.HeaderCell>
                                            Reviewed On
                                        </Table.HeaderCell>
                                        <Table.Cell resizable>
                                            {rowData => {
                                                const reviewedOn = rowData
                                                    .reviewedOn
                                                    ? new Date(
                                                          rowData.reviewedOn
                                                      ).toLocaleString()
                                                    : null;

                                                return rowData
                                                    .reviewedOn ? (
                                                    <p>{reviewedOn}</p>
                                                ) : (
                                                    <p
                                                        style={{
                                                            color: 'green'
                                                        }}>
                                                        -
                                                    </p>
                                                );
                                            }}
                                        </Table.Cell>
                                    </Table.Column>

                                    <Table.Column width={150} resizable>
                                        <Table.HeaderCell>
                                            Student Name
                                        </Table.HeaderCell>
                                        <Table.Cell
                                            dataKey='studentName'
                                            resizable
                                        />
                                    </Table.Column>

                                    <Table.Column width={150} resizable>
                                        <Table.HeaderCell>
                                            Status
                                        </Table.HeaderCell>
                                        <Table.Cell style={{ color: 'red' }}>
                                            {rowData => {
                                                return rowData.status ===
                                                    'new' ? (
                                                    <p id='status' style={{ color: 'red' }}>
                                                        Pending Review
                                                    </p>
                                                ) : (
                                                    <p
                                                        id='status'
                                                        style={{
                                                            color: 'Green'
                                                        }}>
                                                        Reviewed
                                                    </p>
                                                );
                                            }}
                                        </Table.Cell>
                                    </Table.Column>

                                    <Table.Column
                                        width={100}
                                        resizable
                                        fixed='right'>
                                        <Table.HeaderCell>
                                            Action
                                        </Table.HeaderCell>
                                        <Table.Cell>
                                            {rowData => {
                                                return (
                                                    <Button
                                                        id='reviewBtn'
                                                        onClick={() =>
                                                            this.reviewAssignment(
                                                                rowData
                                                            )
                                                        }>
                                                        Review
                                                    </Button>
                                                );
                                            }}
                                        </Table.Cell>
                                    </Table.Column>
                                </Table>
                            </Panel>
                        </>
                    );
                })}
            </Container>
        );
    }
}
