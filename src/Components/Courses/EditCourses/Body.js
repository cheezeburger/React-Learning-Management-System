import React from "react";
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
	Uploader,
	InputNumber,
} from "rsuite";

const qualificationData = [
	{ label: "Primary School", value: "primary-school" },
	{ label: "High School", value: "high-school" },
	{ label: "College", value: "college" },
	{ label: "Degree", value: "degree" },
	{ label: "Masters", value: "master" },
	{ label: "Other", value: "other" }
];

const difficultyLevel = [
	{ label: "Fundamental", value: "fundamental" },
	{ label: "Intermediate", value: "intermediate" },
	{ label: "Advanced", value: "advanced" },
	{ label: "Fundamental-Intermediate", value: "fundamental-intermediate" },
	{ label: "Fundamental-Advanced", value: "fundamental-advanced" },
	{ label: "Other", value: "other" }
];

class Body extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			course: null,
			showError: false,
			errorPlacement: "bottomStart",
			formValue: {
				title: "",
				qualification: "",
				levelOfStudy: "",
				description: "",
				prerequisite: ""
			},
			featureImage: null,
			uploading: false,
			setFileInfo: null,
		};
		this.formSubmit = this.formSubmit.bind(this);
		this.retrievePageCourse = this.retrievePageCourse.bind(this);
	}

	retrievePageCourse(id) {
        const coursesList = this.props.coursesList? this.props.coursesList : [];
        if(coursesList){
            let foundCourse = null;
            for (let i = 0; i < coursesList.length; i++) {
                if (coursesList[i].uid === `-${id}`) {
                    foundCourse = coursesList[i];
                    break;
                }
            }
            this.setState({ course: foundCourse });
        }
	}
	
	formSubmit() {
		const formValue = this.state.formValue;
		const course = this.state.course;

		const formValueKeys = Object.keys(formValue);

		formValueKeys.forEach(key=> {
			if(formValue[key]){
				course[key]	= formValue[key]
			}
		})

		this.props.firebase
			.course(`-${this.props.match.params.id}`)
			.update(
				{
					title: course.title,
					qualification: course.qualification,
					levelOfStudy: course.levelOfStudy,
					description: course.description,
					prerequisite: course.prerequisite,
					image: this.state.setFileInfo? this.state.setFileInfo : course.image
				},
				err => {
					if (err) {
						Alert.error(
							"An error occurred while creating course. Please try again.",
							5000
						);
					}
				}
			)
			.then(rsp => {
				this.props.history.push(`/courses/${this.props.match.params.id}`);
			});
		
	}

	previewFile(file, callback) {
		const reader = new FileReader();
		reader.onloadend = () => {
			callback(reader.result);
		};
		reader.readAsDataURL(file);
	}

	componentDidMount(){
		this.retrievePageCourse(this.props.match.params.id);
	}

	render() {
		const course = this.state.course? this.state.course: null;

		return (
			<div>
				{course?
					<Container style={{ flex: 1, flexDirection: "column" }}>
						<Container style={{ alignItems: "center" }}>
							<Uploader
								dragable={true}
								listType="picture"
								fileListVisible={false}
								action="/"
								onUpload={file => {
									this.setState({ uploading: true });
									this.previewFile(file.blobFile, value => {
										this.setState({ setFileInfo: value});
									});
								}}
							>
							<Button style={{ width: "150px", height: "150px" }}>
								{this.state.setFileInfo ? (
									<img
										src={this.state.setFileInfo}
										width="100%"
										height="100%"
										alt=""
									/>
								) : (
									<img src={course.image} alt='' style={{ width: "150px", height: "150px" }}/>
								)}
							</Button>	
							</Uploader>
						</Container>

						<Container>
							<Form fluid onChange={formValue => this.setState({ formValue })}>
								<FormGroup>
									<ControlLabel>Course Title</ControlLabel>
									<FormControl 
										name="title" 
										value={this.state.formValue.title? this.state.formValue.title: course.title}/>
								</FormGroup>
								<FormGroup>
									<ControlLabel>Qualification</ControlLabel>
									<FormControl
										name="qualification"
										accepter={SelectPicker}
										placeholder="Default"
										data={qualificationData}
										value={this.state.formValue.qualification? this.state.formValue.qualification: course.qualification}
									/>
								</FormGroup>
								<FormGroup>
									<ControlLabel>Level</ControlLabel>
									<FormControl
										name="levelOfStudy"
										accepter={SelectPicker}
										placeholder="Default"
										data={difficultyLevel}
										value={this.state.formValue.levelOfStudy? this.state.formValue.levelOfStudy: course.levelOfStudy}

									/>
								</FormGroup>
								<FormGroup>
									<ControlLabel>Duration (Hours)</ControlLabel>
									<FormControl
										style={{ width: "90px" }}
										name="duration"
										accepter={InputNumber}
										value={this.state.formValue.duration? this.state.formValue.duration: course.duration}
									/>
								</FormGroup>
								<FormGroup>
									<ControlLabel>Course Description</ControlLabel>
									<FormControl
										rows={5}
										name="description"
										componentClass="textarea"
										value={this.state.formValue.description? this.state.formValue.description: course.description}
									/>
								</FormGroup>
								<FormGroup>
									<ControlLabel>Prerequisites</ControlLabel>
									<FormControl
										rows={5}
										name="prerequisite"
										componentClass="textarea"
										placeholder="Eg. Basic business knowledge"
										value={this.state.formValue.prerequisite? this.state.formValue.prerequisite: course.prerequisite}
									/>
								</FormGroup>
								<FormGroup>
									<ButtonToolbar>
										<Button appearance="ghost" onClick={this.formSubmit}>
											Save
										</Button>
									</ButtonToolbar>
								</FormGroup>
							</Form>
						</Container>
					</Container>
				: <p>Loading...</p>	
			}
			</div>
		);
	}
}

export default Body;