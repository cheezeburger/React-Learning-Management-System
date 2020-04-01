import React from "react";
import {
	Modal,
	Form,
	FormGroup,
	ControlLabel,
	FormControl,
	Container,
	Button,
	ButtonToolbar,
	Alert,
	Toggle,
} from "rsuite";

export default class CurriculumModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editorContext: null,
			content: null,
			formValue: {
				title: "",
				shortDescription: "",
				allowPreview: false,
			}
		};
		this.formSubmit = this.formSubmit.bind(this);
	}

	close() {
		this.setState({ show: false });
	}
	open(size) {
		this.setState({ show: true });
	}

	onDanteSaveHandler(editorContext, content) {
		this.setState({ editorContext, content });
	}

	formSubmit() {
		let { title, shortDescription, allowPreview } = this.state.formValue;
		const courseId = this.props.match.params.id;
		allowPreview = !!(allowPreview);

		if (!title || !shortDescription) {
			Alert.error("Title and description cannot be empty.", 5000);
		} else {
			this.props.firebase
				.courseCurriculums(`-${courseId}`)
				.push({ title, shortDescription, allowPreview }, err => {
					if (err) {
						Alert.error(
							"An error occurred while creating curriculum. Please try again.",
							5000
						);
					}
				})
				.then(rsp => {
					const curriculumId = rsp.key.substr(1, rsp.key.length);
					this.props.history.push(
						`/courses/${courseId}/curriculum/${curriculumId}`
					);
			});
		}
	}

	render() {
		return (
			<div className="modal-container">
				<Modal.Header>
					<Modal.Title>Add Curriculum</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Container style={{ height: "100%" }}>
						<Form fluid onChange={formValue => this.setState({ formValue })}>
							<FormGroup>
								<ControlLabel>Title</ControlLabel>
								<FormControl name="title" />
							</FormGroup>

							<FormGroup>
								<ControlLabel>Short Description</ControlLabel>
								<FormControl name="shortDescription" />
							</FormGroup>

							<FormGroup>
								<ControlLabel>Allow Preview?</ControlLabel>
								<p style={{fontSize:'10px', fontStyle: 'italic', padding: '3px'}}>Enabling this option will allow non-login users to access the curriculum.</p>
								<FormControl
									name="allowPreview"
									defaultValue="false"
									accepter={Toggle}
								/>
							</FormGroup>

							<FormGroup>
								<ButtonToolbar style={{ textAlign: "center" }}>
									<Button
										appearance="ghost"
										onClick={this.formSubmit}
										style={{ width: "100px" }}
									>
										Next
									</Button>
								</ButtonToolbar>
							</FormGroup>
						</Form>
					</Container>
				</Modal.Body>
			</div>
		);
	}
}
