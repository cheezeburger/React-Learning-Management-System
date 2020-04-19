import React from 'react';
import {
	Container,
	FormGroup,
	Form,
	FormControl,
	ControlLabel,
	SelectPicker,
	Button,
	ButtonToolbar,
	Alert,
} from "rsuite";

class Body extends React.Component{
    constructor(props) {
		super(props);
		this.state = {
			showError: false,
			errorPlacement: "bottomStart",
			formValue: {
                courseId: '',
                announcement: '',
			},
            userCreatedCourses: null,
            
		};
        this.formSubmit = this.formSubmit.bind(this);
        this.getCreatedCourses = this.getCreatedCourses.bind(this);
	}

	formSubmit() {
		const { courseId, announcement } = this.state.formValue;

		if (!courseId ||!announcement) {
			Alert.error("Please fill in all fields.", 5000);
		} else {
            this.props.firebase.course(courseId).child('announcements').push(
                {
                    createdOn: Date.now(),
                    createdBy: this.props.authUser.name,
                    content: announcement,
                },
                err => {
                    if (err) {
                        Alert.error(
                            "An error occurred while creating announcement. Please try again.",
                            5000
                        );
                    }
                }
            ).then(rsp => {
                Alert.success('Announcement created successfully.');
                this.props.history.push(`/dashboard`);
            })
		}
	}

    getCreatedCourses(){
        let userCreatedCourses = this.props.coursesList;
        const uid = this.props.authUser.uid;
        
        userCreatedCourses = userCreatedCourses.filter(course=> {
            return course.createdBy === uid
        })

        userCreatedCourses = userCreatedCourses.map(course=> {
            return{ 
                label: course.title, 
                value: course.uid,
            };
        })

        this.setState({userCreatedCourses});
    }

    componentDidMount(){
        this.getCreatedCourses();
    }
	render() {
		return (
			<div>
				<Container style={{ flex: 1, flexDirection: "column" }}>
					<Container>

						<Form fluid onChange={formValue => this.setState({ formValue })}>
                            <FormGroup>
                                <ControlLabel>Add announcement to course:</ControlLabel>
                                <FormControl
                                    name="courseId"
                                    accepter={SelectPicker}
                                    placeholder="--Select--"
                                    data={this.state.userCreatedCourses? this.state.userCreatedCourses: {
                                        label: 'null',
                                        value: 'null'
                                    }}
                                />
                            </FormGroup>

							<FormGroup>
								<ControlLabel>Announcement Content</ControlLabel>
								<FormControl
									rows={5}
									name="announcement"
									componentClass="textarea"
								/>
							</FormGroup>

                            <FormGroup>
                                <ButtonToolbar style={{ textAlign: "center" }}>
                                    <Button
                                        appearance="ghost"
                                        onClick={this.formSubmit}
                                        style={{ width: "100px" }}
                                    >
                                        Create
                                    </Button>
                                </ButtonToolbar>
                            </FormGroup>
						</Form>
					</Container>
				</Container>
			</div>
		);
	}
}

export default Body;