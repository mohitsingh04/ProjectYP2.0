import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import ALLImages from '../../common/Imagesdata';

const Additionalcontent = () => {
    return (
        <Fragment>

            <Pageheader homepage='Additional Content' activepage='Utilities' page='Additional Content' />

            <Row>
                <Col xl={6}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Vertical alignment With table cells
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="table-responsive">
                                        <table style={{ height: "100px" }}>
                                            <tbody>
                                                <tr>
                                                    <td className="align-baseline">baseline</td>
                                                    <td className="align-top">top</td>
                                                    <td className="align-middle">middle</td>
                                                    <td className="align-bottom">bottom</td>
                                                    <td className="align-text-top">text-top</td>
                                                    <td className="align-text-bottom">text-bottom</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Vertical alignment With inline elements
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <span className="align-baseline me-1">baseline</span>
                                    <span className="align-top me-1">top</span>
                                    <span className="align-middle me-1">middle</span>
                                    <span className="align-bottom me-1">bottom</span>
                                    <span className="align-text-top me-1">text-top</span>
                                    <span className="align-text-bottom">text-bottom</span>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xl={6}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Opacity
                                    </div>
                                </Card.Header>
                                <Card.Body className="d-sm-flex">
                                    <div className="opacity-100 p-3 m-2 bg-primary text-fixed-white fw-bold rounded">100%
                                    </div>
                                    <div className="opacity-75 p-3 m-2 bg-primary text-fixed-white fw-bold rounded">75%</div>
                                    <div className="opacity-50 p-3 m-2 bg-primary text-fixed-white fw-bold rounded">50%</div>
                                    <div className="opacity-25 p-3 m-2 bg-primary text-fixed-white fw-bold rounded">25%</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Horizontal centering
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div >
                                        <div className="mx-auto" style={{ width: "200px", padding: "10px", borderRadius: "4px", backgroundColor: "rgba(86,61,124,.15)" }}> Centered element </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Relative to the parent
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-5">
                                <div className="w-25 p-3 bg-light">Width 25%</div>
                                <div className="w-50 p-3 bg-light">Width 50%</div>
                                <div className="w-75 p-3 bg-light">Width 75%</div>
                                <div className="w-100 p-3 bg-light">Width 100%</div>
                                <div className="w-auto p-3 bg-light">Width auto</div>
                            </div>
                            <div style={{ height: "100px", backgroundColor: "rgba(255,0,0,0.1)" }} className="d-flex">
                                <div className="h-25 d-inline-block" style={{ width: "120px", backgroundColor: "rgba(0,0,255,.1)", paddingInline: "10px" }}> Height 25% </div>
                                <div className="h-50 d-inline-block" style={{ width: "120px", backgroundColor: "rgba(0,0,255,.1)", padding: "10px" }}> Height 50% </div>
                                <div className="h-75 d-inline-block" style={{ width: "120px", backgroundColor: "rgba(0,0,255,.1)", padding: "10px" }}> Height 75% </div>
                                <div className="h-100 d-inline-block" style={{ width: "120px", backgroundColor: "rgba(0,0,255,.1)", padding: "10px" }}> Height 100% </div>
                                <div className="h-auto d-sm-inline-block d-none" style={{ width: "120px", backgroundColor: "rgba(0,0,255,.1)", padding: "10px" }}> Height auto </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                You can also use <span className="text-danger"> max-width: 100%;</span> and <span
                                    className="text-danger">max-height: 100%;</span> utilities as needed.
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <img className="bd-placeholder-img mw-100 card-img" src={ALLImages('media7')} alt="..." />
                            <div style={{ height: "100px", backgroundColor: "rgba(255,0,0,0.1)" }} className="mt-3">
                                <div className="mh-100" style={{ width: "100px", height: "200px", backgroundColor: "rgba(0,0,255,0.1)", padding: "10px" }}> Max-height 100% </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xl={4}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Display Inline
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="d-inline p-2 bg-primary text-fixed-white rounded m-1">d-inline</div>
                                    <div className="d-inline p-2 bg-primary-transparent text-primary rounded m-1">d-inline</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        D-block
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <span className="d-block p-2 bg-secondary-transparent mb-1 rounded">d-block</span>
                                    <span className="d-block p-2 bg-primary-transparent mb-1 rounded">d-block</span>
                                    <span className="d-block p-2 bg-success-transparent mb-1 rounded">d-block</span>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xl={4}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Float
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="float-start p-2 bg-primary rounded text-fixed-white mb-2">Float start</div><br />
                                    <div className="float-end p-2 bg-primary rounded text-fixed-white">Float end</div><br />
                                    <div className="float-none p-2 bg-primary rounded text-fixed-white mt-4">Don't float</div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Float Responsive
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="float-sm-start p-1 bg-light">Float sm
                                    </div>
                                    <br />
                                    <div className="float-md-end p-1 bg-light">Float md
                                    </div>
                                    <br />
                                    <div className="float-lg-start p-1 bg-light">Float lg
                                    </div>
                                    <br />
                                    <div className="float-xl-end p-1 bg-light">Float  xl
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xl={4}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Text selection
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <p className="user-select-all">This paragraph will be entirely selected when clicked
                                        by
                                        the user.
                                    </p>
                                    <p className="user-select-auto">This paragraph has default select behavior.</p>
                                    <p className="user-select-none mb-0">This paragraph will not be selectable when clicked
                                        by
                                        the user.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Pointer events
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <p><Link to="#" className="pe-none" tabIndex={-1} aria-disabled="false"><code className="text-primary fw-medium me-1 d-inline-flex">This link </code></Link>
                                        can
                                        not be clicked.
                                    </p>
                                    <p><Link to="#" className="pe-auto"><code className="text-primary fw-medium me-1 d-inline-flex">This link </code></Link> can be clicked (this is default
                                        behavior).
                                    </p>
                                    <p className="pe-none mb-0"><Link to="#" tabIndex={-1} aria-disabled="false"><code>This link </code></Link>
                                        can
                                        not be clicked because the <code className="text-primary fw-medium">pointer-events</code> property is inherited
                                        from its parent. However, <Link to="#" className="pe-auto">this link </Link> has a
                                        <code> pe-auto</code> class and can be clicked.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Gap
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-grid gap-3">
                                <div className="p-2 bg-light border">Grid item 1</div>
                                <div className="p-2 bg-light border">Grid item 2</div>
                                <div className="p-2 bg-light border">Grid item 3</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Examples
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="shadow-none p-3 mb-3 bg-light rounded">No shadow</div>
                            <div className="shadow-sm p-3 mb-3 bg-body rounded">Small shadow</div>
                            <div className="shadow p-3 mb-3 bg-body rounded">Regular shadow</div>
                            <div className="shadow-lg p-3 bg-body rounded">Larger shadow</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Overflow
                            </div>
                        </Card.Header>
                        <Card.Body className="d-md-flex">
                            <div className="overflow-auto p-3 mb-3 mb-md-0 me-md-3 bg-light" style={{ maxWidth: "260px", maxHeight: "100px" }}>
                                This is an example of using <code>.overflow-auto</code> on an element with set width and height dimensions. By design, this content will vertically scroll.
                            </div>
                            <div className="overflow-hidden p-3 mb-3 mb-md-0 me-md-3 bg-light" style={{ maxWidth: "260px", maxHeight: "100px" }}>
                                This is an example of using <code>.overflow-hidden</code> on an element with set width and height dimensions.
                            </div>
                            <div className="overflow-visible p-3 mb-3 mb-md-0 me-md-3 bg-light" style={{ maxWidth: "260px", maxHeight: "100px" }}>
                                This is an example of using <code>.overflow-visible</code> on an element with set width and height dimensions.
                            </div>
                            <div className="overflow-scroll p-3 bg-light" style={{ maxWidth: "260px", maxHeight: "100px" }}>
                                This is an example of using <code>.overflow-scroll</code> on an element with set width and height dimensions.
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </Fragment>
    );
};

export default Additionalcontent;