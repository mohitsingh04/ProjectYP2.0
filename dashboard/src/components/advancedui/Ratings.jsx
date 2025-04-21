import React, { Fragment, useState } from 'react'
import StarIcon from '@mui/icons-material/Star';
import { Card, Col, Row } from 'react-bootstrap';
import Rating from '@mui/material/Rating';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Customizable, HoverRating } from '../../common/Ratingfunction';

const Ratings = () => {
  const [value, _setValue] = useState(5);
  const [value2, setValue2] = useState(2);
  const [value0, _setValue0] = useState();
  return (
    <Fragment>
      <Pageheader homepage='Ratings' activepage='Advanced Ui' page='Ratings' />

      <Row className="row-sm">
        <Col xxl={4} xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                Basic Rating
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <p className="fs-14 mb-0 fw-semibold">Show Some <span className="text-danger">&#10084;</span> with rating :</p>

                <Rating name="read-only" value={value} emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />

              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={4} xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                5 star rater with steps
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <p className="fs-14 mb-0 fw-semibold">Dont forget to rate the product :</p>

                <Rating name="simple-controlled" value={value2} onChange={(_event, newValue) => { setValue2(newValue); }} emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />

              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={4} xl={12}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                Custom messages
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <p className="fs-14 mb-0 fw-semibold">Your rating is much appreciated&#128079; :</p>

                <Rating name="customized-10" defaultValue={6} max={10} emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />

              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={6} xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                Rating with customer review
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <div>
                  <p className="fs-14 mb-0 fw-semibold">Thanks for rating :</p>
                </div>
                <div>
                  <Customizable />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={6} xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                Rating Size
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <Rating name="size-small" defaultValue={2} size="small" emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />
                <Rating name="size-medium" defaultValue={2} emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />
                <Rating name="size-large" defaultValue={2} size="large" emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={4} xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                On hover event
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <p className="fs-14 mb-0 fw-semibold">Please give your valuable rating :</p>
                <div className="d-flex flex-wrap align-items-center">
                  <HoverRating />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={4} xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                Disabled
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <p className="fs-14 mb-0 fw-semibold">Disabled rating :</p>
                <div className="d-flex flex-wrap align-items-center">
                  <Rating name="disabled" defaultValue={value0} disabled emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={4} xl={6}>
          <Card className="custom-card">
            <Card.Header>
              <div className="card-title">
                Readonly Rating
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap align-items-center justify-content-between">
                <p className="fs-14 mb-0 fw-semibold">Show Some <span className="text-danger">&#10084;</span> with rating :</p>

                <Rating name="read-only" value={value} readOnly />

              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default Ratings