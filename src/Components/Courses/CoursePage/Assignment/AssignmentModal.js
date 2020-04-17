import React from 'react';
import {
    Modal,
    Container,
    Uploader,
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    SelectPicker,
    Button,
    ButtonToolbar,
    Alert,
    Progress
} from 'rsuite';

const { Line } = Progress;

export default class AssignmentModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curriculum: [],
            formValue: {
                title: '',
                curriculum: '',
                type: '',
                uploaded: false
            },
            assFile: null,
            uploaderDisabled: false,
            uploadProgressShow: false,
            uploadProgress: 0
        };

        this.onUploadChange = this.onUploadChange.bind(this);
        this.getCurriculums = this.getCurriculums.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.formNext = this.formNext.bind(this);
    }

    getCurriculums() {
        //Get curriculums
        this.props.firebase
            .courseCurriculums('-' + this.props.match.params.id)
            .once('value')
            .then(snapshot => {
                const curriculums = snapshot.val();

                if (curriculums) {
                    const objKeys = Object.keys(curriculums);
                    let curriculum = [];

                    objKeys.forEach(item => {
                        const obj = {
                            value: item,
                            label: curriculums[item].title.trim()
                        };
                        curriculum.push(obj);
                        this.setState({ curriculum });
                    });
                }
            });
    }

    componentDidMount() {
        this.getCurriculums();
    }

    onUploadChange(file) {
        if (this.state.assFile) {
            this.setState({
                assFile: null
            });
        } else {
            this.setState({
                assFile: file
            });
        }
    }

    formSubmit() {
        const { title, curriculum, type } = this.state.formValue;
        const courseId = '-' + this.props.match.params.id;
        const { assFile } = this.state;

        const timestamp = Date.now();
        if (!title || !assFile || !curriculum) {
            Alert.error('Please fill in all fields.');
        } else {
            const upload = this.props.firebase
                .assignmentRef()
                .child(
                    `${this.props.courseTitle}/${timestamp}_${assFile[0].blobFile.name}`
                )
                .put(assFile[0].blobFile);

            upload.on(
                'state_changed',
                snapshot => {
                    let uploadProgress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    this.setState({ uploadProgressShow: true, uploadProgress });
                },
                () => {
                    Alert.error('Upload failed...Please try again...');
                },

                async () => {
                    //Uploaded Successfully...
                    Alert.success('Created successfully');
                    this.setState({ uploaded: true });
                    const url = await upload.snapshot.ref
                        .getDownloadURL()
                        .then(downloadURL => {
                            return downloadURL;
                        });

                    //Store to realtime db
                    this.props.firebase
                        .course(courseId)
                        .child('assignments')
                        .push(
                            {
                                curriId: curriculum.substr(1),
                                title,
                                type,
                                attachmentUrl: url
                            },
                            err => {
                                if (err) {
                                    Alert.error(
                                        'An error occured while creating assignment. Please try again.',
                                        5000
                                    );
                                }
                            }
                        )
                        .then(rsp => {
                            const assKey = rsp.key.substr(1);
                            window.location.reload(false);
                        });
                }
            );
        }
    }

    formNext() {
        const { title, curriculum, type } = this.state.formValue;
        const courseId = '-' + this.props.match.params.id;

        if (!title || !curriculum) {
            Alert.error('Please fill in all fields.');
        } else {
            this.props.firebase
                .course(courseId)
                .child('assignments')
                .push(
                    {
                        curriId: curriculum,
                        title,
                        type
                    },
                    err => {
                        if (err) {
                            Alert.error(
                                'An error occured while creating assignment. Please try again.',
                                5000
                            );
                        }
                    }
                )
                .then(rsp => {
                    const assKey = rsp.key.substr(1);

                    this.props.history.push(
                        `/courses/${courseId.substr(1)}/assignment/${assKey}`
                    );
                });
        }
    }

    render() {
        const { curriculum } = this.state;
        const { assFile } = this.state;
        const uploaderDisabled = assFile ? true : false;

        return (
            <div>
                <Modal.Header>
                    <Modal.Title>Create an Assignment</Modal.Title>

                    <Modal.Body>
                        <Container>
                            <Form
                                fluid
                                onChange={formValue =>
                                    this.setState({ formValue })
                                }>
                                <FormGroup>
                                    <ControlLabel>
                                        Assignment Title
                                    </ControlLabel>
                                    <FormControl name='title' />
                                </FormGroup>

                                <FormGroup>
                                    <ControlLabel>
                                        Assign assignment to curriculum:{' '}
                                    </ControlLabel>
                                    <FormControl
                                        name='curriculum'
                                        accepter={SelectPicker}
                                        placeholder='-'
                                        data={curriculum}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <ControlLabel>
                                        Assignment type:{' '}
                                    </ControlLabel>
                                    <FormControl
                                        name='type'
                                        accepter={SelectPicker}
                                        placeholder='-'
                                        data={assignmentType}
                                    />
                                </FormGroup>

                                {this.state.formValue.type === 'file' ? (
                                    <FormGroup>
                                        <ControlLabel>
                                            Assignment File (Optional):{' '}
                                        </ControlLabel>
                                        <Uploader
                                            disabled={uploaderDisabled}
                                            autoUpload={false}
                                            dragable={true}
                                            action='/'
                                            onChange={this.onUploadChange}
                                            style={{
                                                border: '1px dashed #a4a9b3',
                                                overflowY: 'scroll',
                                                maxHeight: '140px'
                                            }}>
                                            {uploaderDisabled ? (
                                                <div
                                                    style={{
                                                        lineHeight: '80px',
                                                        width: '100%'
                                                    }}>
                                                    Max one(1) file uploaded.
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        lineHeight: '80px',
                                                        width: '100%'
                                                    }}>
                                                    Click or Drag assignment to
                                                    this area to upload
                                                </div>
                                            )}
                                        </Uploader>
                                        {this.state.uploadProgressShow ? (
                                            <Line
                                                percent={
                                                    this.state.uploadProgress
                                                }
                                                status='success'
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </FormGroup>
                                ) : null}

                                <FormGroup>
                                    {this.state.formValue.type ? (
                                        <ButtonToolbar
                                            style={{ textAlign: 'center' }}>
                                            {this.state.formValue.type ==
                                            'file' ? (
                                                <Button
                                                    appearance='ghost'
                                                    disabled={
                                                        this.state.uploaded
                                                    }
                                                    onClick={this.formSubmit}
                                                    style={{ width: '100px' }}>
                                                    Create
                                                </Button>
                                            ) : (
                                                <Button
                                                    appearance='ghost'
                                                    onClick={this.formNext}
                                                    style={{ width: '100px' }}>
                                                    Next
                                                </Button>
                                            )}
                                        </ButtonToolbar>
                                    ) : (
                                        <Button
                                            appearance='ghost'
                                            disabled={true}
                                            style={{ width: '100px' }}>
                                            Create
                                        </Button>
                                    )}
                                </FormGroup>
                            </Form>
                        </Container>
                    </Modal.Body>
                </Modal.Header>
            </div>
        );
    }
}

const assignmentType = [
    {
        value: 'file',
        label: 'Attachment only'
    },
    {
        value: 'subjective',
        label: 'Subjective'
    }
];
