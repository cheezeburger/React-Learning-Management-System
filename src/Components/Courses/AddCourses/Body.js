import React from "react";
import {
	Container,
	FormGroup,
	Form,
	Input,
	FormControl,
	ControlLabel,
	SelectPicker,
	Button,
	ButtonToolbar,
	Alert,
	Uploader,
	Icon
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

const durationAcceptor = ({ onChange }) => {
	return (
		<Input
			type="number"
			onChange={e => {
				onChange(e);
			}}
			style={{ width: "90px" }}
		/>
	);
};

class Body extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showError: false,
			errorPlacement: "bottomStart",
			formValue: {
				title: "",
				qualification: "",
				levelOfStudy: "",
				duration: 0,
				description: "",
				prerequisite: ""
			},
			featureImage: null,
			uploading: false,
			createCourseBtnShow: false,
		};
		this.formSubmit = this.formSubmit.bind(this);
	}

	formSubmit() {
		this.setState({createCourseBtnShow: true});

		const {
			title,
			qualification,
			levelOfStudy,
			duration,
			description,
			prerequisite
		} = this.state.formValue;
		const uid = this.props.firebase.auth.currentUser.uid;
		if (
			!title ||
			!qualification ||
			!levelOfStudy ||
			!duration ||
			!description ||
			!prerequisite ||
			!this.state.setFileInfo
		) {
			Alert.error("Please fill in all fields.", 5000);
			this.setState({createCourseBtnShow: false});
		} else {
			this.props.firebase
				.courses()
				.push(
					{
						createdBy: uid,
						title,
						qualification,
						levelOfStudy,
						duration,
						description,
						prerequisite,
						image: this.state.setFileInfo
					},
					err => {
						if (err) {
							Alert.error(
								"An error occurred while creating course. Please try again.",
								5000
							);
							this.setState({createCourseBtnShow: false});
						}
					}
				)
				.then(rsp => {
					const courseId = rsp.key.substr(1, rsp.key.length);
					this.props.firebase
						.user(uid)
						.child("coursesCreated")
						.push({ courseId });
					this.props.history.push(`/courses/${courseId}`);
				})
				.catch(err =>{
					console.log(err);
				})
		}
	}

	previewFile(file, callback) {
		const reader = new FileReader();
		reader.onloadend = () => {
			callback(reader.result);
		};
		reader.readAsDataURL(file);
	}

	render() {
		return (
			<div>
				<Container style={{ flex: 1, flexDirection: "column" }}>
					<Container style={{ alignItems: "center" }}>
						<Uploader
							dragable
							fileListVisible={false}
							listType="picture"
							action="//jsonplaceholder.typicode.com/posts/"
							onUpload={file => {
								this.setState({ uploading: true });
								this.previewFile(file.blobFile, value => {
									this.setState({ setFileInfo: value });
								});
							}}
							onError={() => {
								// Alert.error("Upload Failed. Please try again.");
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
									<Icon icon="image" size="5x" />
								)}
							</Button>
						</Uploader>
					</Container>
					<Container>
						<Form fluid onChange={formValue => this.setState({ formValue })}>
							<FormGroup>
								<ControlLabel>Course Title</ControlLabel>
								<FormControl name="title" />
							</FormGroup>
							<FormGroup>
								<ControlLabel>Qualification</ControlLabel>
								<FormControl
									name="qualification"
									accepter={SelectPicker}
									placeholder="Default"
									data={qualificationData}
								/>
							</FormGroup>
							<FormGroup>
								<ControlLabel>Level</ControlLabel>
								<FormControl
									name="levelOfStudy"
									accepter={SelectPicker}
									placeholder="Default"
									data={difficultyLevel}
								/>
							</FormGroup>
							<FormGroup>
								<ControlLabel>Duration (Hours)</ControlLabel>
								<FormControl
									name="duration"
									accepter={durationAcceptor}
									placeholder="0"
								/>
							</FormGroup>
							<FormGroup>
								<ControlLabel>Course Description</ControlLabel>
								<FormControl
									rows={5}
									name="description"
									componentClass="textarea"
								/>
							</FormGroup>
							<FormGroup>
								<ControlLabel>Prerequisites</ControlLabel>
								<FormControl
									rows={5}
									name="prerequisite"
									componentClass="textarea"
									placeholder="Eg. Basic business knowledge"
								/>
							</FormGroup>
							<FormGroup>
								<ButtonToolbar>
									<Button disabled={this.state.createCourseBtnShow} appearance="ghost" onClick={this.formSubmit}>
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