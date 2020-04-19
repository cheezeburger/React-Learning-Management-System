import React from 'react';
import { withFirebase } from '../../Firebase';
import { Button, Panel, Table, Modal } from 'rsuite';
import { compose } from 'recompose';
import withCourse from '../../Courses/Context/withCourse';

class StudentCoursePalette extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            courses: [],
            show: false
        };
    }
    async componentDidMount() {
        const enrolledCourses = this.props.authUser.enrolledCourses;
        const coursesList = this.props.coursesList;

        let submissions = [];

        if (enrolledCourses) {
            submissions = Object.keys(enrolledCourses).map(key => {
                const courseId = enrolledCourses[key].courseId;

                const course = coursesList.filter(item => {
                    return item.uid === `-${courseId}`;
                });

                return {
                    courseId: enrolledCourses[key].courseId,
                    courseTitle: course[0].title,
                    submissions: enrolledCourses[key].submissions
                };
            });

            //Extract submissions innerkey
            submissions = submissions.map(item => {
                if (item.submissions) {
                    const key = Object.keys(item.submissions);

                    const submission = key.map(key => {
                        return item.submissions[key];
                    });

                    return {
                        courseId: item.courseId,
                        courseTitle: item.courseTitle,
                        submissions: submission
                    };
                }

                return {
                    courseId: item.courseId,
                    courseTitle: item.courseTitle
                };
            });
            this.setState({ submissions });

            submissions = submissions
                .map(item => {
                    if (item.submissions) {
                        item.submissions = item.submissions.map(inner => {
                            const assId = '-' + inner.assId;

                            const course = coursesList.filter(course => {
                                return course.uid === `-${item.courseId}`;
                            });

                            let assignment = course[0].assignments;
                            const keys = Object.keys(assignment);

                            assignment = keys.map(key => {
                                return {
                                    key,
                                    data: assignment[key]
                                };
                            });

                            assignment = assignment.filter(ass => {
                                return ass.key === assId;
                            });

                            assignment = assignment[0].data;

                            return {
                                ...inner,
                                assTitle: assignment.title
                            };
                        });
                        return;
                    }
                })
                .flat();
        }
    }

    open = () => {
        this.setState({ show: true });
    };

    close = () => {
        this.setState({ show: false });
    };

    render() {
        const submissions = this.state.submissions
            ? this.state.submissions
            : [];

        return (
            <div>
                <div style={{ marginBottom: '5px' }}>
                    <p>My Submissions</p>
                </div>
                <div>
                    {submissions
                        ? submissions.map(submission => {
                              return (
                                  <Panel
                                      bordered
                                      header={submission.courseTitle}>
                                      <Table
                                          data={submission.submissions}
                                          style={{ fontSize: '13px' }}>
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
                                          <Table.Column width={160} resizable>
                                              <Table.HeaderCell>
                                                  Assignment Title
                                              </Table.HeaderCell>
                                              <Table.Cell
                                                  resizable
                                                  dataKey='assTitle'
                                              />
                                          </Table.Column>
                                          <Table.Column width={120} resizable>
                                              <Table.HeaderCell>
                                                  Status
                                              </Table.HeaderCell>
                                              <Table.Cell resizable>
                                                  {rowData => {
                                                      return rowData.status ===
                                                          'new' ? (
                                                          <p
                                                              style={{
                                                                  color: 'red'
                                                              }}>
                                                              Pending Review
                                                          </p>
                                                      ) : (
                                                          <p
                                                              style={{
                                                                  color: 'green'
                                                              }}>
                                                              Reviewed
                                                          </p>
                                                      );
                                                  }}
                                              </Table.Cell>
                                          </Table.Column>
                                          <Table.Column
                                              width={160}
                                              resizable
                                              align='center'>
                                              <Table.HeaderCell>
                                                  Reviewed On
                                              </Table.HeaderCell>
                                              <Table.Cell resizable>
                                                  {rowData => {
                                                      const reviewedOn = rowData.reviewedOn
                                                          ? new Date(
                                                                rowData.reviewedOn
                                                            ).toLocaleString()
                                                          : null;

                                                      return rowData.reviewedOn ? (
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
                                          <Table.Column
                                              width={160}
                                              resizable
                                              align='center'>
                                              <Table.HeaderCell>
                                                  Marks
                                              </Table.HeaderCell>
                                              <Table.Cell resizable>
                                                  {rowData => {
                                                      return rowData.marks ? (
                                                          <p
                                                              style={{
                                                                  fontWeight:
                                                                      'bold'
                                                              }}>
                                                              {rowData.marks}%
                                                          </p>
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
                                          <Table.Column
                                              width={160}
                                              resizable
                                              align='center'>
                                              <Table.HeaderCell>
                                                  Instructor Comments
                                              </Table.HeaderCell>
                                              <Table.Cell resizable>
                                                  {rowData => {
                                                      return rowData.comments ? (
                                                          <>
                                                              <Button
                                                                  onClick={
                                                                      this.open
                                                                  }>
                                                                  Show
                                                              </Button>
                                                              <Modal
                                                                  backdrop='static'
                                                                  show={
                                                                      this.state
                                                                          .show
                                                                  }
                                                                  onHide={
                                                                      this.close
                                                                  }
                                                                  size='xs'>
                                                                  <Modal.Body>
                                                                      <>
                                                                          <p>
                                                                              Instructor
                                                                              comments
                                                                          </p>
                                                                          {
                                                                              rowData.comments
                                                                          }
                                                                      </>
                                                                  </Modal.Body>
                                                                  <Modal.Footer>
                                                                      <Button
                                                                          onClick={
                                                                              this
                                                                                  .close
                                                                          }
                                                                          appearance='primary'>
                                                                          Close
                                                                      </Button>
                                                                  </Modal.Footer>
                                                              </Modal>
                                                          </>
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
                                          </Table.Column>{' '}
                                          */}
                                      </Table>
                                  </Panel>
                              );
                          })
                        : null}
                </div>
            </div>
        );
    }
}

export default compose(withFirebase, withCourse)(StudentCoursePalette);
