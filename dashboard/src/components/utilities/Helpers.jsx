import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import ALLImages from '../../common/Imagesdata';

const Helpers = () => {
    return (
        <Fragment>
            <Pageheader homepage='Helpers' activepage='Utilities' page='Helpers' />

            <Row>
                <Col xxl={5} xl={5} lg={12} md={12} sm={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Colors With backgrounds
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-bg-primary p-3">Primary with contrasting color</div>
                            <div className="text-bg-secondary p-3">Secondary with contrasting color</div>
                            <div className="text-bg-success p-3">Success with contrasting color</div>
                            <div className="text-bg-danger p-3">Danger with contrasting color</div>
                            <div className="text-bg-warning p-3">Warning with contrasting color</div>
                            <div className="text-bg-info p-3">Info with contrasting color</div>
                            <div className="text-bg-light p-3 text-default">Light with contrasting color</div>
                            <div className="text-bg-dark p-3 text-white">Dark with contrasting color</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={4} xl={4} lg={6} md={6} sm={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">With Other Components</div>
                        </Card.Header>
                        <Card.Body>
                            <h6 className="fw-medium mb-3">Badges:</h6>
                            <span className="badge text-bg-primary me-1">Primary</span>
                            <span className="badge text-bg-info mb-4">Info</span>
                            <h6 className="fw-medium mb-3">cards:</h6>
                            <Card className="text-bg-success mb-3 text-fixed-white" style={{ maxWidth: '18rem' }}>
                                <Card.Header className="border-bottom-0">
                                    <div className="card-title text-fixed-white">
                                        Header
                                    </div>
                                </Card.Header>
                                <Card.Body className="pt-0">
                                    <p className="card-text text-fixed-white">Some quick example text to build on the card title
                                        and
                                        make up the bulk of the card's content.</p>
                                </Card.Body>
                            </Card>
                            <Card className="text-bg-danger mb-3 text-fixed-white" style={{ maxWidth: '18rem' }}>
                                <Card.Header className="border-bottom-0">
                                    <div className="card-title text-fixed-white">
                                        Header
                                    </div>
                                </Card.Header>
                                <Card.Body className="pt-0">
                                    <p className="card-text text-fixed-white">Some quick example text to build on the card title
                                        and
                                        make up the bulk of the card's content.</p>
                                </Card.Body>
                            </Card>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={3} xl={3} lg={6} md={6} sm={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Card With Stretched Links
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <img className="bd-placeholder-img card-img-top card-img" src={ALLImages('media4')} alt="..." />
                            <Card.Body className="pb-0">
                                <h5 className="card-title">Card with stretched links</h5>
                                <p className="card-text">
                                    <Link to="#" className="stretched-link text-danger"
                                        style={{ position: "relative" }}>Stretched link will not work
                                        here,
                                        because <code>position: relative</code> is added to the
                                        link</Link>
                                </p>
                                <p className="card-text bg-light mb-0 p-1 rounded" style={{ transform: 'rotate(0)' }}>
                                    This <Link to="#" className="text-warning stretched-link me-1 d-inline-flex">stretched
                                        link</Link>
                                    will only be spread over the <code>p</code>-tag, because a
                                    transform is
                                    applied to it.
                                </p>
                            </Card.Body>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col xxl={6} xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Clearfix
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="bg-light clearfix">
                                <button type="button" className="btn btn-primary float-start m-1">Example Button
                                    floated left</button>
                                <button type="button" className="btn btn-primary float-end m-1">Example Button
                                    floated
                                    right</button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xxl={6} xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Colored links
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-evenly flex-wrap">
                                <Link to="#" className="link-primary fw-medium fs-15 p-1">Primary</Link>
                                <Link to="#" className="link-secondary fw-medium fs-15 p-1">Secondary</Link>
                                <Link to="#" className="link-success fw-medium fs-15 p-1">Success</Link>
                                <Link to="#" className="link-danger fw-medium fs-15 p-1">Danger</Link>
                                <Link to="#" className="link-warning fw-medium fs-15 p-1">Warning</Link>
                                <Link to="#" className="link-info fw-medium fs-15 p-1">Info</Link>
                                <Link to="#" className={`fw-medium fs-15 p-1 text-muted`}>Light</Link>
                                <Link to="#" className="link-dark fw-medium fs-15 p-1">Dark</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Ratio
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="ratio ratio-16x9">
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/-lDlbQ7DiCI"
                                    title="YouTube video player" style={{ border: '0px' }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen></iframe>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Row>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Aspect ratios
                                    </div>
                                </Card.Header>
                                <Card.Body className="bd-example-ratios">
                                    <div className="ratio ratio-1x1 me-1">
                                        <div className="d-flex align-items-center justify-content-center">1x1</div>
                                    </div>
                                    <div className="ratio ratio-4x3 me-1">
                                        <div className="d-flex align-items-center justify-content-center">4x3</div>
                                    </div>
                                    <div className="ratio ratio-16x9 me-1">
                                        <div className="d-flex align-items-center justify-content-center">16x9</div>
                                    </div>
                                    <div className="ratio ratio-21x9">
                                        <div className="d-flex align-items-center justify-content-center">21x9</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header>
                                    <div className="card-title">
                                        Custom ratios
                                    </div>
                                </Card.Header>
                                <Card.Body className="bd-example-ratios bd-example-ratios-breakpoint">
                                    <div className="ratio me-1" style={{ aspectRatio: '1/0.5' }}>
                                        <div className="d-flex align-items-center justify-content-center">2x1</div>
                                    </div>
                                    <div className="ratio ratio-4x3">
                                        <div className="d-flex align-items-center justify-content-center">4x3, then 2x1</div>
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
                                Vertical Stacking
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="vstack gap-3">
                                <div className="bg-light border p-1 px-2 rounded">First item</div>
                                <div className="bg-light border p-1 px-2 rounded">Second item</div>
                                <div className="bg-light border p-1 px-2 rounded">Third item</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={6}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Horizontal Stacking
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="hstack gap-3 mb-3">
                                <div className="bg-light border p-1 px-2 rounded">First item</div>
                                <div className="bg-light border p-1 px-2 rounded">Second item</div>
                                <div className="bg-light border p-1 px-2 rounded">Third item</div>
                            </div>
                            <div className="hstack gap-3 mb-3">
                                <div className="bg-light border p-1 px-2 rounded">First item</div>
                                <div className="bg-light border ms-auto p-1 px-2 rounded">Second item</div>
                                <div className="bg-light border p-1 px-2 rounded">Third item</div>
                            </div>
                            <div className="hstack gap-3">
                                <div className="bg-light border p-1 px-2 rounded">First item</div>
                                <div className="bg-light border ms-auto p-1 px-2 rounded">Second item</div>
                                <div className="vr"></div>
                                <div className="bg-light border p-1 px-2 rounded">Third item</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Vstack For Buttons
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="vstack gap-2 col-md-5 mx-auto">
                                <button type="button" className="btn btn-primary">Save
                                    changes</button>
                                <button type="button" className="btn btn-outline-primary">Cancel</button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Inline Form With Hstack
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="hstack gap-3">
                                <input className="form-control me-auto" type="text"
                                    placeholder="Add your item here..."
                                    aria-label="Add your item here..." />
                                <button type="button" className="btn btn-primary">Submit</button>
                                <div className="vr"></div>
                                <button type="button" className="btn btn-outline-danger">Reset</button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4}>
                    <Card className="custom-card">
                        <Card.Header>
                            <div className="card-title">
                                Text Truncation
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <div className="col-2 text-truncate">
                                    This text is quite long, and will be truncated once displayed.
                                </div>
                            </Row>
                            <span className="d-inline-block text-truncate" style={{ maxWidth: '150px' }}>
                                This text is quite long, and will be truncated once displayed.
                            </span>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Helpers;