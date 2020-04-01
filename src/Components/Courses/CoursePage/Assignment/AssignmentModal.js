import React from "react";
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
} from "rsuite";

const { Line } = Progress;

export default class AssignmentModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			curriculum: [],
			formValue: {
				title: "",
				curriculum: ""
			},
			assFile: null,
			uploaderDisabled: false,
			uploadProgressShow: false,
			uploadProgress: 0
		};

		this.onUploadChange = this.onUploadChange.bind(this);
		this.getCurriculums = this.getCurriculums.bind(this);
		this.formSubmit = this.formSubmit.bind(this);
	}

	getCurriculums() {
		//Get curriculums
		this.props.firebase
			.courseCurriculums("-" + this.props.match.params.id)
			.once("value")
			.then(snapshot => {
				const curriculums = snapshot.val();
				const objKeys = Object.keys(curriculums);
				let curriculum = [];
				objKeys.forEach(item => {
					const obj = {
						value: item,
						label: curriculums[item].title
					};
					curriculum.push(obj);
					this.setState({ curriculum });
				});
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
		const { title, curriculum } = this.state.formValue;
		const { assFile } = this.state;

		const timestamp = Date.now();
		if (!title || !assFile || !curriculum) {
			Alert.error("Please fill in all fields.");
		} else {
			const upload = this.props.firebase
				.assignmentRef()
				.child(
					`${this.props.courseTitle}/${timestamp}_${assFile[0].blobFile.name}`
				)
				.put(assFile[0].blobFile);

			upload.on(
				"state_changed",
				snapshot => {
					let uploadProgress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					this.setState({ uploadProgressShow: true, uploadProgress });
				},
				error => {
					Alert.error("Upload failed...Please try again...");
				},

				async () => {
					//Uploaded Successfully...
					Alert.success("Uploaded successfully");
					const url = await upload.snapshot.ref
						.getDownloadURL()
						.then(downloadURL => {
							return downloadURL;
						});

					//Store to
				}
			);
		}
	}

	render() {
		const { curriculum } = this.state;
		const { assFile } = this.state;
		const uploaderDisabled = assFile ? true : false;
		return (
			<div>
				<Modal.Header>
					<Modal.Title>Upload an Assignment</Modal.Title>

					<Modal.Body>
						<Container>
							<Form fluid onChange={formValue => this.setState({ formValue })}>
								<FormGroup>
									<ControlLabel>Assignment Title</ControlLabel>
									<FormControl name="title" />
								</FormGroup>
								<FormGroup>
									<ControlLabel>Assign assignment to curriculum: </ControlLabel>
									<FormControl
										name="curriculum"
										accepter={SelectPicker}
										placeholder="-"
										data={curriculum}
									/>
								</FormGroup>
								<FormGroup>
									<ControlLabel>Assignment File: </ControlLabel>
									<Uploader
										disabled={uploaderDisabled}
										autoUpload={false}
										action="/"
										onChange={this.onUploadChange}
										style={{
											border: "1px dashed #a4a9b3",
											overflowY: "scroll",
											maxHeight: "140px"
										}}
									>
										{uploaderDisabled ? (
											<div style={{ lineHeight: "80px", width: "100%" }}>
												Max one(1) file uploaded.
											</div>
										) : (
											<div style={{ lineHeight: "80px", width: "100%" }}>
												Click or Drag assignment to this area to upload
											</div>
										)}
									</Uploader>
								</FormGroup>
								{this.state.uploadProgressShow ? (
									<Line percent={this.state.uploadProgress} status="success" />
								) : (
									""
								)}
								<FormGroup>
									<ButtonToolbar style={{ textAlign: "center" }}>
										<Button
											appearance="ghost"
											onClick={this.formSubmit}
											style={{ width: "100px" }}
										>
											Upload
										</Button>
									</ButtonToolbar>
								</FormGroup>
							</Form>
						</Container>
					</Modal.Body>
				</Modal.Header>
			</div>
		);
	}
}
