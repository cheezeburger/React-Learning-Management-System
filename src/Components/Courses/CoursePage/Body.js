import React from 'react';
import {
	Container,
	Button,
	Icon,
	Panel,
	PanelGroup,
	Modal,
	Alert,
	Loader,
	Table
} from 'rsuite';
import CurriculumModal from './Curriculum/CurriculumModal';
import { NavLink, Link } from 'react-router-dom';
import AssignmentModal from './Assignment/AssignmentModal';

export default class Body extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            course                  : null,
            loading                 : true,
            authUser                : null,
            panelNavigate           : '',
			showCurriculumModal     : false,
			showAssignmentModal     : false,			
		};

		this.panelSelect            = this.panelSelect.bind(this);
		this.enrollCourse           = this.enrollCourse.bind(this);
		this.renderCurriculum       = this.renderCurriculum.bind(this);
		this.retrievePageCourse     = this.retrievePageCourse.bind(this);
		this.curriculumModalToggle  = this.curriculumModalToggle.bind(this);
		this.assignmentModalToggle  = this.assignmentModalToggle.bind(this);
	}
	componentWillMount() {
		this.retrievePageCourse(this.props.match.params.id);
		window.scrollTo(0, 0);
	}

	retrievePageCourse(id) {
		const coursesList = this.props.coursesList
			? this.props.coursesList
            : [];
            
		if (coursesList) {
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

	panelSelect(key) {
		this.setState({ panelNavigate: key });
	}

	curriculumModalToggle() {
		this.setState({ showCurriculumModal: !this.state.showCurriculumModal });
	}

	assignmentModalToggle() {
		this.setState({ showAssignmentModal: !this.state.showAssignmentModal });
	}

	renderEnrollButton(isCourseCreator, authUser, enrolledToCourse, courseId) {
		if (isCourseCreator) {
			return (
				<>
					<Link
						to={{
							pathname: `/course/edit/${this.props.match.params.id}`,
							state: {
								course: this.state.course
									? this.state.course
									: null
							}
						}}>
						<Button
							appearance='ghost'
							color='yellow'
							style={{
								width: '100%',
								height: '55px'
							}}>
							<p style={{ fontSize: '16px' }}>Edit Course</p>
						</Button>
					</Link>
				</>
			);
		} else if (
			(authUser && authUser.roles.userRole === 'admin') || enrolledToCourse) {
			return (
				<Button
					appearance='default'
					style={{
						width: '100%',
						height: '55px',
						color: '#202020'
					}}>
					<p style={{ fontSize: '16px' }}>Enrolled</p>
				</Button>
			);
		} else {
			return (
				<Button
					appearance='ghost'
					style={{
						width: '100%',
						height: '55px'
					}}
					onClick={this.enrollCourse}>
					<p style={{ fontSize: '16px' }}>Enroll Course</p>
				</Button>
			);
		}
	}

	enrollCourse() {
		const authUser = this.state.authUser;

		if (!authUser) {
			Alert.error('Login first')
			this.props.history.push('/login');
		} else {
			this.props.firebase
				.user(authUser.uid)
				.child('enrolledCourses')
				.push({ courseId: this.props.match.params.id }, err => {
					if (err) {
						Alert.error(
							'There was an error registering to courses...'
						);
					}
				})
				.then(rsp => {
					const date = Date.now();

					Alert.success('Successfully enrolled to course.');
					this.props.firebase.course(`-${this.props.match.params.id}`).child('students').push({
						studId: authUser.uid,
						joinedOn: date,
					})
				});
		}
	}

	renderCurriculum( allowPreview, isCourseCreator, item, enrolledToCourse) {
        const cid = this.props.match.params.id;

        if (allowPreview || isCourseCreator || enrolledToCourse) {
			return (
				<NavLink
					to={`/courses/${this.props.match.params.id}/curriculum/${item.curriculumId}`}>
					{item.shortDescription}
				</NavLink>
			);
		} else {
			return <p>{item.shortDescription}</p>;
		}
	}

	renderAssignments = (assignment) => {
		return(
			<NavLink
				to={`/courses/${this.props.match.params.id}/assignment/${assignment.assignmentId.substr(1)}`}>
				{assignment.title}
			</NavLink>
		)
	}

	componentDidMount() {
		this.listener = this.props.firebase.onAuthUserListener(
			authUser => {
				return this.setState({ authUser, loading: false });
			},
			() => {
				this.setState({ authUser: null, loading: false });
			}
		);
	}

	render() {
		let coursesCreated      = null;
		let enrolledToCourse    = null;
		let isCourseCreator     = null;
		const courseId          = this.props.match.params.id;
		const authUser          = this.state.authUser ? this.state.authUser : null;

		let {
			levelOfStudy,
			description,
			image,
			duration,
			prerequisite,
			title,
			curriculum,
			assignments,
		} = this.state.course ? this.state.course : {};

		if (this.state.course) {
			if (curriculum) {
				curriculum = Object.keys(curriculum).map(key => ({
					...curriculum[key],
					curriculumId: key.substr(1)
				}));
				console.log('curriculum:', curriculum)
			}

			if(assignments){
				assignments = Object.keys(assignments).map(key => ({
					...assignments[key],
					assignmentId: key
				}));
			}

			if (authUser && !!authUser.coursesCreated) {
				coursesCreated = Object.keys(authUser.coursesCreated).map(
					key => ({
						...authUser.coursesCreated[key],
						uid: key
					})
				);

				coursesCreated = coursesCreated.map(item => {
					return item.courseId;
				});

				isCourseCreator = coursesCreated.includes(
					this.props.match.params.id
				);
			}
		}

		if (authUser && authUser.enrolledCourses) {
			enrolledToCourse = authUser.enrolledCourses;
			console.log('assignments',enrolledToCourse)

			const keys = Object.keys(enrolledToCourse);

			enrolledToCourse = keys.map(key => {
				return enrolledToCourse[key];
			});

			enrolledToCourse = enrolledToCourse.map(item => {
				return item.courseId;
			});

			enrolledToCourse = enrolledToCourse.includes(courseId);
		}
		return (
			<div>
				<div className='modal-container'>
					<Modal
						full
						show={this.state.showCurriculumModal}
						onHide={this.curriculumModalToggle}
						backdrop='static'
						style={{ overflow: 'visible' }}>
						<CurriculumModal {...this.props} />
					</Modal>

					<Modal
						full
						show={this.state.showAssignmentModal}
						onHide={this.assignmentModalToggle}
						backdrop='static'
						style={{ overflow: 'visible' }}>
						<AssignmentModal {...this.props} courseTitle={title} />
					</Modal>
				</div>
				<Container style={{ flex: 1, flexDirection: 'row' }}>
					<Container
						style={{
							flex: 3,
							flexDirection: 'column'
						}}>
						<Container
							style={{
								justifyContent: 'flex-start',
								maxWidth: '90%'
							}}>
							<Container
								style={{
									marginBottom: '50px',
									minHeight: '100px'
								}}>
								<h2>{title}</h2>
								<p
									style={{
										marginTop: '40px',
										fontSize: '20px'
									}}>
									{description}
								</p>
							</Container>

							<Container
								style={{
									marginBottom: '50px',
									minHeight: '50px'
								}}>
								<h4 style={{ fontWeight: 'bold' }}>Duration</h4>
								<p
									style={{
										marginTop: '40px',
										fontSize: '20px'
									}}>
									{duration} Hours
								</p>
							</Container>

							<Container
								style={{
									marginBottom: '50px',
									minHeight: '50px'
								}}>
								<h4 style={{ fontWeight: 'bold' }}>
									Requirements
								</h4>
								<p
									style={{
										marginTop: '40px',
										fontSize: '20px'
									}}>
									{prerequisite}
								</p>
							</Container>

							{this.state.loading ? (
								<Loader />
							) : (
								<>
									<Container style={{ marginBottom: '50px' }}>
										<h4
											style={{
												padding: '5px',
												fontWeight: 'bold'
											}}>
											Curriculum
										</h4>
										<PanelGroup
											onSelect={this.panelSelect}
											accordion={true}
											style={{
												backgroundColor: '#fffff0',
												minHeight: '80px'
											}}>
											{curriculum ? (
												curriculum.map((item, i) => {
													const allowPreview = !!item.allowPreview;
													return (
														<Panel
														key={i}
															header={item.title}
															eventKey={
																item.curriculumId
															}>
															{this.renderCurriculum(
																allowPreview,
																isCourseCreator,
																item,
																enrolledToCourse,
															)}
														</Panel>
													);
												})
											) : (
												<Container>
													<Panel header='No curriculum found...' />
												</Container>
											)}
											{authUser && isCourseCreator ? (
												<Button
													appearance='subtle'
													onClick={this.curriculumModalToggle}>
													+ Add curriculum
												</Button>
											) : null}
										</PanelGroup>
									</Container>
									<Container>
										<h4
											style={{
												padding: '5px',
												fontWeight: 'bold'
											}}>
											Assignments
										</h4>
										{	(enrolledToCourse || authUser && authUser.roles.userRole === 'admin')?
											<Panel header="Assignments" bordered bodyFill>
												<Table height={400} data={assignments} style={{fontSize: '12px'}}>
													<Table.Column width={50} align="center" resizable>
														<Table.HeaderCell>Id</Table.HeaderCell>
														<Table.Cell dataKey="assignmentId"/>
													</Table.Column>

													<Table.Column flexGrow={1} align="center" fixed>
														<Table.HeaderCell>Assignment Title</Table.HeaderCell>
														<Table.Cell dataKey="title"/>
													</Table.Column>

													<Table.Column width={80} align="center" fixed>
														<Table.HeaderCell>Type</Table.HeaderCell>
														<Table.Cell dataKey="type"/>
													</Table.Column>

													<Table.Column width={110} align="center" fixed="right">
														<Table.HeaderCell>Action</Table.HeaderCell>
														<Table.Cell>
															{rowData => {
																if(rowData.type === 'subjective'){
																	return(
																		<NavLink to={`/courses/${this.props.match.params.id}/assignment/${rowData.assignmentId.substr(1)}`}>
																			<Button>View</Button>
																		</NavLink>
																	)
																}
																else{
																	return(
																		<a href={rowData.attachmentUrl}>
																			<Button>View</Button>
																		</a>
																	)
																}
															}}
														</Table.Cell>
													</Table.Column>
												</Table>
												{authUser && isCourseCreator ? (
													<Button
														appearance='subtle'
														onClick={
															this.assignmentModalToggle
														}>
														+ Add assignments
													</Button>
												) : null}
											</Panel>
											: <p style={{fontSize: '12px'}}>Enroll to view assignments...</p>
										}
										{/* <PanelGroup
											style={{
												backgroundColor: '#fffff0',
												minHeight: '80px'
											}}>	
											{assignments ? (
												assignments.map((item, i) => {
													let curi = curriculum.filter(curri => {
														return curri.curriculumId === item.curriId.substr(1);
													})

													return (
														<Panel
															key={i}
															header={curi[0].title}
														>
															{this.renderAssignments(item)}
														</Panel>
													);
												})
											) : (
												<Container>
													<Panel header='No assignments found...' />
												</Container>
											)}
											{authUser && isCourseCreator ? (
												<Button
													appearance='subtle'
													onClick={
														this.assignmentModalToggle
													}>
													+ Add assignments
												</Button>
											) : null}
										</PanelGroup> */}
									</Container>
								</>
							)}
						</Container>
					</Container>

					<Container
						style={{
							flex: 1,
							alignItems: 'right',
							maxWidth: '222px'
						}}>
						<div style={{ width: '220px', height: '200px' }}>
							<img
								src={image}
								width='100%'
								height='100%'
								alt=''
							/>
						</div>
						<Container style={{ flexDirection: 'column' }}>
							<Container
								style={{
									textTransform: 'capitalize',
									flexDirection: 'row',
									padding: '10px',
									maxHeight: '50px'
								}}>
								<Icon
									style={{ fontSize: '1em' }}
									icon='universal-access'
								/>
								<p style={{ paddingLeft: '10px', fontSize: '15px' }}>
									{levelOfStudy}
								</p>
							</Container>
							<Container>
								{this.renderEnrollButton(
									isCourseCreator,
									authUser,
									enrolledToCourse,
									courseId
								)}
							</Container>
						</Container>
					</Container>
				</Container>
			</div>
		);
	}
}