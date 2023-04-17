import React, {  } from "react";
import { Row, Col } from "react-bootstrap";

export default function ({ data }) {
    return (
        <Row col={2}>
            <Col xs={3}>
                <strong>{data.name}</strong>
                <br />
                Adults: {data.occupancy.maxAdults}
                <br />
                Children: {data.occupancy.maxChildren}
            </Col>
            <Col>{data.longDescription}</Col>
        </Row>
    );
}
